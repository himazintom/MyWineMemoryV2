import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { pwaService } from './services/pwaService'

// Initialize PWA service
pwaService.registerServiceWorker().then(() => {
  console.log('PWA Service initialized');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
