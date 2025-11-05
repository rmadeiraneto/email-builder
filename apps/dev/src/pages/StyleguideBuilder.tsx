/**
 * Styleguide Builder Page
 *
 * Interactive design system builder where tokens can be customized in real-time
 * with side-by-side preview and token editor
 */

import { type Component, createSignal, createEffect, onMount, Show } from 'solid-js';
import styles from './StyleguideBuilder.module.scss';
import { ColorTokens } from '../components/styleguide/ColorTokens';
import { TypographyTokens } from '../components/styleguide/TypographyTokens';
import { SpacingTokens } from '../components/styleguide/SpacingTokens';
import { BorderTokens } from '../components/styleguide/BorderTokens';
import { ShadowTokens } from '../components/styleguide/ShadowTokens';
import { ComponentShowcase } from '../components/styleguide/ComponentShowcase';
import { TokenEditor } from '../components/styleguide-builder/TokenEditor';
import { tokenStorage, type CustomTokens } from '../utils/tokenStorage';
import { applyCustomTokens, removeCustomTokens, TokenExporter } from '../utils/tokenApplier';
import { getDefaultTokens, mergeTokens, getAllTokensFlat } from '../utils/tokenLoader';

// Import default tokens
import defaultBrandColors from '@email-builder/tokens/colors/brand';
import defaultSemanticColors from '@email-builder/tokens/colors/semantic';
import defaultUiColors from '@email-builder/tokens/colors/ui';
import defaultFonts from '@email-builder/tokens/typography/fonts';
import defaultSizes from '@email-builder/tokens/typography/sizes';
import defaultWeights from '@email-builder/tokens/typography/weights';
import defaultLineHeights from '@email-builder/tokens/typography/line-heights';
import defaultSpacingData from '@email-builder/tokens/spacing/scale';
import defaultBorderRadius from '@email-builder/tokens/border/radius';
import defaultBorderWidth from '@email-builder/tokens/border/width';
import defaultElevation from '@email-builder/tokens/shadow/elevation';

type Section = 'colors' | 'typography' | 'spacing' | 'border' | 'shadow' | 'animation' | 'breakpoints' | 'components';

const StyleguideBuilder: Component = () => {
  const [activeSection, setActiveSection] = createSignal<Section>('colors');
  const [customTokens, setCustomTokens] = createSignal<CustomTokens>({});
  const [isSaving, setIsSaving] = createSignal(false);
  const [saveStatus, setSaveStatus] = createSignal<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const sections: { id: Section; label: string }[] = [
    { id: 'colors', label: 'Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'spacing', label: 'Spacing' },
    { id: 'border', label: 'Borders' },
    { id: 'shadow', label: 'Shadows' },
    { id: 'animation', label: 'Animation' },
    { id: 'breakpoints', label: 'Breakpoints' },
    { id: 'components', label: 'Components' },
  ];

  // Load custom tokens from IndexedDB on mount
  onMount(async () => {
    try {
      const savedTokens = await tokenStorage.loadTokens();
      if (savedTokens) {
        setCustomTokens(savedTokens);
      }
    } catch (error) {
      console.error('Failed to load custom tokens:', error);
    }
  });

  // Apply custom tokens whenever they change
  createEffect(() => {
    const tokens = customTokens();
    if (Object.keys(tokens).length > 0) {
      applyCustomTokens(tokens);
    } else {
      removeCustomTokens();
    }
  });

  // Handle token changes from the editor
  const handleTokenChange = (path: string[], value: any) => {
    setCustomTokens((prev) => {
      const updated = { ...prev };
      let current: any = updated;

      // Navigate to the parent object
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }

      // Set the value
      const lastKey = path[path.length - 1];
      if (!current[lastKey]) {
        current[lastKey] = {};
      }
      current[lastKey].$value = value;

      return updated;
    });
  };

  // Save tokens to IndexedDB
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');

    try {
      await tokenStorage.saveTokens(customTokens());
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save tokens:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default tokens
  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all tokens to their default values? This cannot be undone.')) {
      try {
        await tokenStorage.clearTokens();
        setCustomTokens({});
        removeCustomTokens();
        alert('Tokens have been reset to defaults');
      } catch (error) {
        console.error('Failed to reset tokens:', error);
        alert('Failed to reset tokens');
      }
    }
  };

  // Export tokens in various formats
  const handleExport = (format: 'json' | 'w3c' | 'js' | 'ts' | 'css' | 'scss') => {
    const allTokens = getAllTokensFlat();
    const mergedTokens = mergeTokens(allTokens, customTokens());
    const exporter = new TokenExporter(mergedTokens);
    exporter.download(format);
  };

  // Handle section navigation from preview clicks
  const handleNavigateToSection = (section: Section) => {
    setActiveSection(section);
    // Scroll editor panel to top for better UX
    const editorPanel = document.querySelector(`.${styles.editorPanel}`);
    if (editorPanel) {
      editorPanel.scrollTop = 0;
    }
  };

  // Get the current category tokens for the editor
  const getCurrentCategoryTokens = () => {
    const defaultTokens = getDefaultTokens();
    const category = defaultTokens.find(cat => cat.name === activeSection());

    if (!category) {
      return {};
    }

    return mergeTokens(category.tokens, customTokens());
  };

  // Helper functions to get merged tokens for specific components
  const getMergedColorTokens = () => {
    const custom = customTokens();
    return {
      brandColors: mergeTokens(defaultBrandColors, custom),
      semanticColors: mergeTokens(defaultSemanticColors, custom),
      uiColors: mergeTokens(defaultUiColors, custom),
    };
  };

  const getMergedTypographyTokens = () => {
    const custom = customTokens();
    return {
      fonts: mergeTokens(defaultFonts, custom),
      sizes: mergeTokens(defaultSizes, custom),
      weights: mergeTokens(defaultWeights, custom),
      lineHeights: mergeTokens(defaultLineHeights, custom),
    };
  };

  const getMergedSpacingTokens = () => {
    return mergeTokens(defaultSpacingData, customTokens());
  };

  const getMergedBorderTokens = () => {
    const custom = customTokens();
    return {
      borderRadius: mergeTokens(defaultBorderRadius, custom),
      borderWidth: mergeTokens(defaultBorderWidth, custom),
    };
  };

  const getMergedShadowTokens = () => {
    return mergeTokens(defaultElevation, customTokens());
  };

  return (
    <div class={styles.styleguideBuilder}>
      {/* Header */}
      <header class={styles.header}>
        <div class={styles.headerContent}>
          <div class={styles.headerInfo}>
            <h1 class={styles.title}>Styleguide Builder</h1>
            <p class={styles.subtitle}>
              Customize design tokens and see changes in real-time
            </p>
          </div>
          <div class={styles.headerActions}>
            <button
              class={styles.buttonSecondary}
              onClick={handleReset}
              title="Reset to default values"
            >
              Reset
            </button>
            <button
              class={`${styles.buttonPrimary} ${isSaving() ? styles.buttonLoading : ''}`}
              onClick={handleSave}
              disabled={isSaving()}
            >
              {saveStatus() === 'saving' && 'Saving...'}
              {saveStatus() === 'saved' && '✓ Saved'}
              {saveStatus() === 'error' && '✗ Error'}
              {saveStatus() === 'idle' && 'Save'}
            </button>
            <div class={styles.exportDropdown}>
              <button class={styles.buttonPrimary}>
                Export ▼
              </button>
              <div class={styles.exportMenu}>
                <button onClick={() => handleExport('json')}>JSON</button>
                <button onClick={() => handleExport('w3c')}>W3C Format</button>
                <button onClick={() => handleExport('js')}>JavaScript</button>
                <button onClick={() => handleExport('ts')}>TypeScript</button>
                <button onClick={() => handleExport('css')}>CSS</button>
                <button onClick={() => handleExport('scss')}>SCSS</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav class={styles.nav}>
        <ul class={styles.navList}>
          {sections.map((section) => (
            <li>
              <button
                class={activeSection() === section.id ? styles.navItemActive : styles.navItem}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content - Side by Side */}
      <div class={styles.mainContent}>
        {/* Preview Panel */}
        <div class={styles.previewPanel}>
          <div class={styles.previewContent}>
            <Show when={activeSection() === 'colors'}>
              <ColorTokens
                {...getMergedColorTokens()}
                onSectionClick={() => handleNavigateToSection('colors')}
              />
            </Show>
            <Show when={activeSection() === 'typography'}>
              <TypographyTokens
                {...getMergedTypographyTokens()}
                onSectionClick={() => handleNavigateToSection('typography')}
              />
            </Show>
            <Show when={activeSection() === 'spacing'}>
              <SpacingTokens
                spacingData={getMergedSpacingTokens()}
                onSectionClick={() => handleNavigateToSection('spacing')}
              />
            </Show>
            <Show when={activeSection() === 'border'}>
              <BorderTokens
                {...getMergedBorderTokens()}
                onSectionClick={() => handleNavigateToSection('border')}
              />
            </Show>
            <Show when={activeSection() === 'shadow'}>
              <ShadowTokens
                elevation={getMergedShadowTokens()}
                onSectionClick={() => handleNavigateToSection('shadow')}
              />
            </Show>
            <Show when={activeSection() === 'components'}>
              <ComponentShowcase
                onSectionClick={() => handleNavigateToSection('colors')}
              />
            </Show>
            <Show when={activeSection() === 'animation' || activeSection() === 'breakpoints'}>
              <div class={styles.comingSoon}>
                <h2>Coming Soon</h2>
                <p>This section is under construction.</p>
              </div>
            </Show>
          </div>
        </div>

        {/* Editor Panel */}
        <div class={styles.editorPanel}>
          <TokenEditor
            category={sections.find(s => s.id === activeSection())?.label || ''}
            tokens={getCurrentCategoryTokens()}
            onTokenChange={handleTokenChange}
          />
        </div>
      </div>
    </div>
  );
};

export default StyleguideBuilder;
