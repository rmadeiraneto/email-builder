/**
 * Styleguide Page
 *
 * Living design system documentation showcasing all design tokens,
 * components, and UI patterns.
 */

import { type Component, createSignal } from 'solid-js';
import styles from './Styleguide.module.scss';
import { ColorTokens } from '../components/styleguide/ColorTokens';
import { TypographyTokens } from '../components/styleguide/TypographyTokens';
import { SpacingTokens } from '../components/styleguide/SpacingTokens';
import { ComponentShowcase } from '../components/styleguide/ComponentShowcase';

type Section = 'colors' | 'typography' | 'spacing' | 'borders' | 'shadows' | 'components';

const Styleguide: Component = () => {
  const [activeSection, setActiveSection] = createSignal<Section>('colors');

  const sections: { id: Section; label: string }[] = [
    { id: 'colors', label: 'Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'spacing', label: 'Spacing' },
    { id: 'borders', label: 'Borders & Radius' },
    { id: 'shadows', label: 'Shadows' },
    { id: 'components', label: 'Components' },
  ];

  return (
    <div class={styles.styleguide}>
      {/* Header */}
      <header class={styles.header}>
        <div class={styles.container}>
          <h1 class={styles.title}>Email Builder Design System</h1>
          <p class={styles.subtitle}>
            A comprehensive showcase of design tokens, components, and UI patterns
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav class={styles.nav}>
        <div class={styles.container}>
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
        </div>
      </nav>

      {/* Content */}
      <main class={styles.main}>
        <div class={styles.container}>
          {activeSection() === 'colors' && <ColorTokens />}
          {activeSection() === 'typography' && <TypographyTokens />}
          {activeSection() === 'spacing' && <SpacingTokens />}
          {activeSection() === 'components' && <ComponentShowcase />}
          {/* Other sections to be implemented */}
        </div>
      </main>
    </div>
  );
};

export default Styleguide;
