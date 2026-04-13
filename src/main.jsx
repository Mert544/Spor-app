import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/globals.css';
import { useSettingsStore } from './store/useSettingsStore';
import { applyTheme, loadTheme } from './styles/theme';

// Apply theme on mount
const { getCurrentTheme } = useSettingsStore.getState();
const themeToApply = getCurrentTheme();
if (themeToApply !== 'system') {
  applyTheme(themeToApply);
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('V-Taper Coach crashed:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', color: '#fff', background: '#0f172a', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ color: '#E94560', fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>
              Uygulama yüklenemedi
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {this.state.error.message}
            </p>
            <pre style={{ background: '#1e293b', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', overflow: 'auto', maxHeight: '200px', marginBottom: '1.25rem' }}>
              {this.state.error.stack}
            </pre>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.reload()}
                style={{ padding: '0.75rem 1.25rem', background: '#14B8A6', color: '#fff', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 'bold' }}
              >
                Sayfayı Yenile
              </button>
              <button
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                style={{ padding: '0.75rem 1.25rem', background: '#E94560', color: '#fff', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 'bold' }}
              >
                Veriyi Sil ve Yenile
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
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
