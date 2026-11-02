import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './components/LanguageSelector/LanguageProvider'
import { API_BASE_URL } from './config/api'

// Dynamically route all API calls to VITE_API_BASE_URL (Render backend) when deployed
if (API_BASE_URL && API_BASE_URL !== 'http://localhost:8081') {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === 'string' && input.includes('http://localhost:8081')) {
      input = input.replace('http://localhost:8081', API_BASE_URL);
    } else if (input instanceof Request && input.url.includes('http://localhost:8081')) {
      input = new Request(input.url.replace('http://localhost:8081', API_BASE_URL), input);
    }
    return originalFetch.call(this, input, init);
  };

  const originalOpen = window.open;
  window.open = function (url, ...args) {
    if (typeof url === 'string' && url.includes('http://localhost:8081')) {
      url = url.replace('http://localhost:8081', API_BASE_URL);
    }
    return originalOpen.call(this, url, ...args);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
