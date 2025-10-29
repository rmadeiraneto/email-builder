/**
 * Main App component for development sandbox
 */

import { Component } from 'solid-js';
import styles from './App.module.scss';

const App: Component = () => {
  return (
    <div class={styles.app}>
      <header class={styles.header}>
        <h1>Email Builder</h1>
        <p>Development Sandbox</p>
      </header>

      <main class={styles.main}>
        <div class={styles.card}>
          <h2>Welcome to Email Builder Dev Environment</h2>
          <p>
            This is a development sandbox for testing UI components and features.
          </p>
          <p>
            <strong>Status:</strong> Monorepo setup complete! 🎉
          </p>
          <ul>
            <li>✅ Design tokens created</li>
            <li>✅ Vite configurations ready</li>
            <li>⏳ Ready to build components</li>
          </ul>
        </div>

        <div class={styles.info}>
          <h3>Next Steps:</h3>
          <ol>
            <li>Install dependencies: <code>pnpm install</code></li>
            <li>Build tokens: <code>cd packages/tokens && pnpm build</code></li>
            <li>Start dev server: <code>pnpm dev</code></li>
            <li>Start building components!</li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default App;
