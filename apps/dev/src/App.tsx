/**
 * Main App component for development sandbox
 */

import { type Component, createSignal, Show } from 'solid-js';
import Styleguide from './pages/Styleguide';
import Builder from './pages/Builder';
import styles from './App.module.scss';

type Page = 'builder' | 'styleguide';

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
      </nav>

      <Show when={currentPage() === 'builder'}>
        <Builder />
      </Show>
      <Show when={currentPage() === 'styleguide'}>
        <Styleguide />
      </Show>
    </div>
  );
};

export default App;
