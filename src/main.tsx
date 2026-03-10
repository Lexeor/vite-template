import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';
import './index.css';
import App from './App.tsx';

OverlayScrollbars(document.body, {
  scrollbars: {
    autoHide: 'scroll',
    autoHideDelay: 600,
    theme: 'os-theme-dark',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
