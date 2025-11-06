/**
 * Email Builder - Development Sandbox
 *
 * This is the entry point for the development sandbox app.
 * Use this to test and develop UI components.
 */

import { render } from 'solid-js/web';
import App from './App';
import '@email-builder/tokens/css';
import 'remixicon/fonts/remixicon.css';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

render(() => <App />, root);
