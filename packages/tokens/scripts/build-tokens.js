/**
 * Build script for design tokens
 *
 * Transforms design tokens from JSON (W3C format) into:
 * - CSS custom properties
 * - SCSS variables
 * - JavaScript/TypeScript modules
 */

const StyleDictionary = require('style-dictionary');
const fs = require('fs');
const path = require('path');

console.log('Building design tokens...\n');

// Register parser for W3C Design Tokens format
StyleDictionary.registerParser({
  pattern: /\.json$/,
  parse: ({ contents }) => {
    const data = JSON.parse(contents);

    // Transform W3C format ($value, $type, $description) to Style Dictionary format
    function transformTokens(obj) {
      const result = {};

      for (const [key, value] of Object.entries(obj)) {
        // Skip $type at category level
        if (key === '$type') continue;

        if (value && typeof value === 'object') {
          if ('$value' in value) {
            // This is a token - transform it
            result[key] = {
              value: value.$value,
              ...(value.$description && { comment: value.$description }),
              ...(value.$type && { type: value.$type }),
            };
          } else {
            // This is a nested group - recurse
            result[key] = transformTokens(value);
          }
        }
      }

      return result;
    }

    return transformTokens(data);
  },
});

// Custom formatter for TypeScript
StyleDictionary.registerFormat({
  name: 'typescript/module',
  formatter: ({ dictionary }) => {
    const tokens = dictionary.allTokens
      .map((token) => {
        const path = token.path.join('.');
        const value = JSON.stringify(token.value);
        return `  '${path}': ${value},`;
      })
      .join('\n');

    return `/**
 * Design Tokens
 *
 * Auto-generated from design token JSON files.
 * Do not edit directly.
 */

export const tokens = {
${tokens}
} as const;

export type TokenPath = keyof typeof tokens;
`;
  },
});

// Custom formatter for SCSS with better organization
StyleDictionary.registerFormat({
  name: 'scss/variables-organized',
  formatter: ({ dictionary }) => {
    const groups = {};

    dictionary.allTokens.forEach((token) => {
      const category = token.path[0];
      if (!groups[category]) {
        groups[category] = [];
      }
      // Replace dots with hyphens in each path segment for valid SCSS variable names
      const sanitizedPath = token.path.map(segment => String(segment).replace(/\./g, '-'));
      const varName = sanitizedPath.join('-');
      groups[category].push(`$${varName}: ${token.value};`);
    });

    let output = `/**
 * Design Tokens - SCSS Variables
 *
 * Auto-generated from design token JSON files.
 * Do not edit directly.
 */\n\n`;

    Object.keys(groups).forEach((category) => {
      output += `// ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
      output += groups[category].join('\n') + '\n\n';
    });

    return output;
  },
});

// Build configuration
const config = {
  source: ['src/**/*.json'],
  platforms: {
    // CSS Custom Properties
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },

    // SCSS Variables
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables-organized',
        },
      ],
    },

    // JavaScript/ES6
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },

    // TypeScript
    ts: {
      transformGroup: 'js',
      buildPath: 'build/ts/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'typescript/module',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
  },
};

// Build tokens
const sd = StyleDictionary.extend(config);
sd.buildAllPlatforms();

console.log('\n✅ Design tokens built successfully!\n');
console.log('Generated files:');
console.log('  - build/css/variables.css');
console.log('  - build/scss/_variables.scss');
console.log('  - build/js/tokens.js');
console.log('  - build/ts/tokens.ts');
console.log('  - build/ts/tokens.d.ts\n');
