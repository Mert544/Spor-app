import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/globals.css';
import { useSettingsStore } from './store/useSettingsStore';
import { applyTheme, loadTheme } from './styles/theme';
import ErrorBoundary from './components/UI/ErrorBoundary.jsx';

// Apply theme on mount
const { getCurrentTheme } = useSettingsStore.getState();
const themeToApply = getCurrentTheme();
if (themeToApply !== 'system') {
  applyTheme(themeToApply);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
