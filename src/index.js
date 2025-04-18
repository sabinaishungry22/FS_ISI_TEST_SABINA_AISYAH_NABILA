import React from 'react';
import { createRoot } from 'react-dom/client'; // <-- CORRECT IMPORT
import App from './App';
import './index.css';
import './dist/output.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);