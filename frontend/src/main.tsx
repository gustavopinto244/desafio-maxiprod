import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Ponto de entrada da aplicacao React.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {' '}
    <App />
  </StrictMode>
);
