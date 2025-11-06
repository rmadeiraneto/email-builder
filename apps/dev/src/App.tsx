/**
 * Main App component for development sandbox
 */

import { type Component, createSignal, Show } from 'solid-js';
import Styleguide from './pages/Styleguide';
import StyleguideBuilder from './pages/StyleguideBuilder';
import Builder from './pages/Builder';
import ComponentShowcase from './pages/ComponentShowcase';
import styles from './App.module.scss';

type Page = 'builder' | 'styleguide' | 'styleguide-builder' | 'components';

const App: Component = () => {
  const [currentPage, setCurrentPage] = createSignal<Page>('builder');

  return (
    <div class={styles.app}>
      <nav class={styles.nav}>
        <button
          class={currentPage() === 'builder' ? styles.active : ''}
          onClick={() => setCurrentPage('builder')}
        >
          Builder
        </button>
        <button
          class={currentPage() === 'styleguide' ? styles.active : ''}
          onClick={() => setCurrentPage('styleguide')}
        >
          Styleguide
        </button>
        <button
          class={currentPage() === 'styleguide-builder' ? styles.active : ''}
          onClick={() => setCurrentPage('styleguide-builder')}
        >
          Styleguide Builder
        </button>
        <button
          class={currentPage() === 'components' ? styles.active : ''}
          onClick={() => setCurrentPage('components')}
        >
          Components
        </button>
      </nav>

      <Show when={currentPage() === 'builder'}>
        <Builder />
      </Show>
      <Show when={currentPage() === 'styleguide'}>
        <Styleguide />
      </Show>
      <Show when={currentPage() === 'styleguide-builder'}>
        <StyleguideBuilder />
      </Show>
      <Show when={currentPage() === 'components'}>
        <ComponentShowcase />
      </Show>
    </div>
  );
};

export default App;
