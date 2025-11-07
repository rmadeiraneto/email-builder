/**
 * Customization System Examples
 * Comprehensive examples demonstrating the new customization features
 */

import { CustomizationManager } from '../customization/CustomizationManager';
import { LocalStorageAdapter } from '../services/LocalStorageAdapter';
import type { Theme } from '../types/theme.types';
import type { ComponentVariant } from '../types/variant.types';
import type { StyleRecipe } from '../types/recipe.types';

// ============================================================================
// EXAMPLE 1: Basic Setup
// ============================================================================

export function example1_basicSetup() {
  console.log('=== Example 1: Basic Setup ===\n');

  // Initialize the customization manager
  const customization = new CustomizationManager({
    storage: new LocalStorageAdapter(),
    loadDefaults: true, // Load default themes, variants, and recipes
  });

  // Check what's available
  const stats = customization.getStats();
  console.log('Available resources:', stats);
  // Output: { themes: 4, variants: 30+, recipes: 20+, profiles: 0, blueprints: 0 }

  return customization;
}

// ============================================================================
// EXAMPLE 2: Working with Themes
// ============================================================================

export function example2_workingWithThemes() {
  console.log('\n=== Example 2: Working with Themes ===\n');

  const customization = new CustomizationManager({ loadDefaults: true });

  // List all available themes
  const themes = customization.themes.getAll();
  console.log('Available themes:', themes.map((t) => t.name));
  // Output: ['Modern', 'Minimal', 'Bold', 'Elegant']

  // Set active theme
  customization.themes.setCurrentTheme('bold');
  console.log('Active theme:', customization.themes.getCurrent()?.name);

  // Create a custom theme
  const myTheme = customization.themes.create({
    name: 'My Brand Theme',
    description: 'Custom theme for my brand',
    category: 'business',
  });

  console.log('Created theme:', myTheme.name);

  // Use theme tokens
  const tokens = customization.themes.createTokenResolver('modern');
  const primaryColor = tokens.color('primary.500');
  const largeFontSize = tokens.fontSize('xl');

  console.log('Primary color:', primaryColor);
  console.log('Large font size:', largeFontSize);

  return customization;
}

// ============================================================================
// EXAMPLE 3: Using Component Variants
// ============================================================================

export function example3_componentVariants() {
  console.log('\n=== Example 3: Component Variants ===\n');

  const customization = new CustomizationManager({ loadDefaults: true });

  // Get button variants
  const buttonVariants = customization.variants.getByComponentType('BUTTON');
  console.log('Button variants:', buttonVariants.map((v) => v.name));
  // Output: ['Primary', 'Secondary', 'Outline', 'Ghost', 'Gradient', ...]

  // Apply a single variant
  const primaryButtonStyles = customization.variants.applyVariants(['button-primary']);
  console.log('Primary button styles:', primaryButtonStyles);

  // Combine multiple variants (e.g., primary + large)
  const largePrimaryButton = customization.variants.applyVariants([
    'button-primary',
    'button-lg',
  ]);
  console.log('Large primary button:', largePrimaryButton);

  // Create a custom variant
  const customVariant = customization.variants.create({
    name: 'Neon Button',
    description: 'Eye-catching neon button',
    category: 'style',
    componentType: 'BUTTON',
    styles: {
      backgroundColor: '#00ff00',
      border: {
        width: { value: 2, unit: 'px' },
        style: 'solid',
        color: '#00ff00',
        radius: { value: 9999, unit: 'px' },
      },
      customStyles: {
        boxShadow: '0 0 20px #00ff00',
      },
    },
  });

  console.log('Created custom variant:', customVariant.name);

  return customization;
}

// ============================================================================
// EXAMPLE 4: Composing Style Recipes
// ============================================================================

export function example4_styleRecipes() {
  console.log('\n=== Example 4: Style Recipes ===\n');

  const customization = new CustomizationManager({ loadDefaults: true });

  // Get all recipes
  const recipes = customization.recipes.getAll();
  console.log('Available recipes:', recipes.map((r) => r.name).slice(0, 5));

  // Apply a single recipe
  const cardStyles = customization.recipes.apply('card');
  console.log('Card styles:', cardStyles);

  // Compose multiple recipes
  const fancyCard = customization.recipes.applyMultiple(['card', 'shadow-lg', 'rounded']);
  console.log('Fancy card (card + shadow + rounded):', fancyCard);

  // Create a custom recipe
  const customRecipe = customization.recipes.create({
    name: 'Featured Section',
    description: 'Highlighted section for important content',
    category: 'surface',
    styles: {
      backgroundColor: '#fffbeb',
      border: {
        width: { value: 2, unit: 'px' },
        style: 'dashed',
        color: '#fbbf24',
        radius: { value: 0.5, unit: 'rem' },
      },
      padding: {
        top: { value: 32, unit: 'px' },
        right: { value: 32, unit: 'px' },
        bottom: { value: 32, unit: 'px' },
        left: { value: 32, unit: 'px' },
      },
    },
  });

  console.log('Created custom recipe:', customRecipe.name);

  return customization;
}

// ============================================================================
// EXAMPLE 5: Style Builder (Fluent API)
// ============================================================================

export function example5_styleBuilder() {
  console.log('\n=== Example 5: Style Builder ===\n');

  const customization = new CustomizationManager({ loadDefaults: true });

  // Use the fluent style builder API
  const myButtonStyles = customization
    .styleBuilder()
    .withRecipe('clickable') // Make it clickable
    .withVariant('button-primary') // Use primary button variant
    .withVariant('button-lg') // Make it large
    .withOverrides({
      // Add custom overrides
      customStyles: {
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      },
    })
    .build();

  console.log('Built button styles:', myButtonStyles);

  // Another example: Card with multiple effects
  const enhancedCard = customization
    .styleBuilder()
    .withRecipe('card')
    .withRecipe('shadow-lg')
    .withRecipe('spacious')
    .withOverrides({
      backgroundColor: '#f0f9ff',
    })
    .build();

  console.log('Enhanced card:', enhancedCard);

  return customization;
}

// ============================================================================
// EXAMPLE 6: Creating and Using Profiles
// ============================================================================

export function example6_customizationProfiles() {
  console.log('\n=== Example 6: Customization Profiles ===\n');

  const customization = new CustomizationManager({ loadDefaults: true });

  // Create a complete customization profile
  const ecommerceProfile = customization.profiles.create({
    name: 'E-commerce Pro',
    description: 'Professional e-commerce email templates',
    category: 'ecommerce',
    theme: customization.themes.get('modern')!,
    variants: customization.variants.getAll().slice(0, 10),
    recipes: customization.recipes.getAll().slice(0, 8),
  });

  console.log('Created profile:', ecommerceProfile.name);

  // Export the profile to share
  const profileJSON = customization.profiles.exportToJSON(ecommerceProfile.id);
  console.log('Profile exported (first 100 chars):', profileJSON.substring(0, 100) + '...');

  // Import a profile
  // const importedProfile = customization.profiles.importFromJSON(profileJSON);
  // console.log('Imported profile:', importedProfile.name);

  // Apply a profile
  customization.profiles.setCurrent(ecommerceProfile.id);
  console.log('Active profile:', customization.profiles.getCurrent()?.name);

  return customization;
}

// ============================================================================
// EXAMPLE 7: Template Blueprints
// ============================================================================

export function example7_templateBlueprints() {
  console.log('\n=== Example 7: Template Blueprints ===\n');

  const customization = new CustomizationManager({ loadDefaults: true });

  // Create a welcome email blueprint
  const welcomeBlueprint: any = {
    id: 'welcome-simple',
    name: 'Simple Welcome Email',
    description: 'A simple welcome email template',
    category: 'welcome',
    structure: [
      {
        id: 'header-section',
        name: 'Header',
        type: 'header',
        layout: { type: 'single' },
        components: [
          {
            id: 'logo',
            type: 'IMAGE',
            slotId: 'logo',
            componentData: {
              type: 'IMAGE',
              metadata: { name: 'Logo' },
              styles: {},
              content: {},
            },
            order: 1,
          },
        ],
        required: true,
        repeatable: false,
        order: 1,
      },
      {
        id: 'hero-section',
        name: 'Hero',
        type: 'hero',
        layout: { type: 'single' },
        components: [
          {
            id: 'welcome-heading',
            type: 'TEXT',
            slotId: 'headline',
            componentData: {
              type: 'TEXT',
              metadata: { name: 'Welcome Heading' },
              styles: {},
              content: { text: 'Welcome!' },
            },
            order: 1,
          },
        ],
        required: true,
        repeatable: false,
        order: 2,
      },
    ],
    slots: [
      {
        id: 'logo',
        name: 'Logo',
        type: 'logo',
        allowedComponents: ['IMAGE'],
        minComponents: 1,
        maxComponents: 1,
      },
      {
        id: 'headline',
        name: 'Headline',
        type: 'headline',
        allowedComponents: ['TEXT'],
        minComponents: 1,
        maxComponents: 1,
      },
    ],
    defaults: {
      canvasWidth: 600,
      colorScheme: 'light',
      spacing: 'comfortable',
    },
    metadata: {
      tags: ['welcome', 'onboarding'],
      difficulty: 'beginner',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  };

  customization.blueprints.register(welcomeBlueprint);
  console.log('Registered blueprint:', welcomeBlueprint.name);

  // Instantiate a template from the blueprint
  const result = customization.blueprints.instantiate({
    blueprintId: 'welcome-simple',
    name: 'My Welcome Email',
    slotContent: {
      logo: {
        componentType: 'IMAGE',
        content: { url: 'https://example.com/logo.png', alt: 'Company Logo' },
      },
      headline: {
        componentType: 'TEXT',
        content: { text: 'Welcome to Our Platform!' },
      },
    },
  });

  if (result.success) {
    console.log('Template created from blueprint:', result.template?.metadata.name);
  } else {
    console.log('Blueprint instantiation failed:', result.errors);
  }

  return customization;
}

// ============================================================================
// EXAMPLE 8: Complete Workflow
// ============================================================================

export function example8_completeWorkflow() {
  console.log('\n=== Example 8: Complete Workflow ===\n');

  const customization = new CustomizationManager({
    storage: new LocalStorageAdapter(),
    loadDefaults: true,
  });

  // Step 1: Choose a theme
  customization.themes.setCurrentTheme('modern');
  console.log('✓ Theme selected: Modern');

  // Step 2: Create a button with multiple customizations
  const ctaButtonStyles = customization.applyCustomization({
    themeId: 'modern',
    variantIds: ['button-primary', 'button-lg'],
    recipeIds: ['shadow-md', 'rounded'],
    overrides: {
      customStyles: {
        textTransform: 'uppercase',
        fontWeight: '700',
      },
    },
  });

  console.log('✓ CTA Button created with styles:', ctaButtonStyles);

  // Step 3: Create a card container
  const cardStyles = customization.applyCustomization({
    recipeIds: ['card', 'spacious', 'shadow-lg'],
  });

  console.log('✓ Card container created');

  // Step 4: Save current customization as a profile
  const myProfile = customization.captureCurrentState(
    'My Email Campaign',
    'Custom profile for marketing campaigns'
  );

  console.log('✓ Profile saved:', myProfile.name);

  // Step 5: Export everything for backup/sharing
  const exportData = customization.exportAll();
  console.log('✓ Customization exported (size:', exportData.length, 'chars)');

  // Step 6: Get statistics
  const stats = customization.getStats();
  console.log('✓ Final statistics:', stats);

  return customization;
}

// ============================================================================
// EXAMPLE 9: Advanced Theme Customization
// ============================================================================

export function example9_advancedTheming() {
  console.log('\n=== Example 9: Advanced Theme Customization ===\n');

  const customization = new CustomizationManager({ loadDefaults: true });

  // Duplicate an existing theme
  const modernTheme = customization.themes.get('modern')!;
  const myTheme = customization.themes.duplicate('modern', 'My Custom Theme');

  console.log('✓ Duplicated theme:', myTheme.name);

  // Update theme colors
  customization.themes.update(myTheme.id, {
    colors: {
      ...myTheme.colors,
      primary: {
        50: '#e0f2fe',
        100: '#bae6fd',
        200: '#7dd3fc',
        300: '#38bdf8',
        400: '#0ea5e9',
        500: '#0284c7',
        600: '#0369a1',
        700: '#075985',
        800: '#0c4a6e',
        900: '#082f49',
      },
    },
  });

  console.log('✓ Updated theme colors');

  // Create theme tokens resolver
  const tokens = customization.themes.createTokenResolver(myTheme.id);

  // Use tokens in recipes
  const themedRecipe = customization.recipes.create({
    name: 'Branded Button',
    category: 'interactive',
    styles: {
      backgroundColor: tokens.color('primary.500'),
      padding: {
        top: tokens.spacing(4),
        right: tokens.spacing(6),
        bottom: tokens.spacing(4),
        left: tokens.spacing(6),
      },
    },
  });

  console.log('✓ Created theme-aware recipe:', themedRecipe.name);

  return customization;
}

// ============================================================================
// EXAMPLE 10: Search and Discovery
// ============================================================================

export function example10_searchAndDiscovery() {
  console.log('\n=== Example 10: Search and Discovery ===\n');

  const customization = new CustomizationManager({ loadDefaults: true });

  // Search across all resources
  const searchResults = customization.searchAll('button');
  console.log('Search results for "button":');
  console.log('  - Themes:', searchResults.themes.length);
  console.log('  - Variants:', searchResults.variants.length);
  console.log('  - Recipes:', searchResults.recipes.length);

  // Get recommendations for a component
  const buttonRecommendations = customization.getRecommendations('BUTTON');
  console.log('\nRecommendations for BUTTON:');
  console.log('  - Variants:', buttonRecommendations.variants.map((v) => v.name).slice(0, 3));
  console.log('  - Recipes:', buttonRecommendations.recipes.map((r) => r.name).slice(0, 3));

  // Browse by category
  const surfaceRecipes = customization.recipes.getByCategory('surface');
  console.log('\nSurface recipes:', surfaceRecipes.map((r) => r.name));

  return customization;
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

export function runAllExamples() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║   EMAIL BUILDER CUSTOMIZATION SYSTEM - EXAMPLES             ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  example1_basicSetup();
  example2_workingWithThemes();
  example3_componentVariants();
  example4_styleRecipes();
  example5_styleBuilder();
  example6_customizationProfiles();
  example7_templateBlueprints();
  example8_completeWorkflow();
  example9_advancedTheming();
  example10_searchAndDiscovery();

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║   ALL EXAMPLES COMPLETED                                     ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
}

// Run examples if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runAllExamples();
}
