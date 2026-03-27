import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';
import './index.css';
import App from './App.tsx';
import AdminApp from './admin/AdminApp.tsx';

OverlayScrollbars(document.body, {
  scrollbars: {
    autoHide: 'scroll',
    autoHideDelay: 600,
    theme: 'os-theme-dark',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
