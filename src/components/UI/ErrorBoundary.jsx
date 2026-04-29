import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="text-4xl mb-4">🛠️</div>
            <h2 className="text-lg font-bold text-white mb-2">Bir şeyler ters gitti</h2>
            <p className="text-sm text-white/50 mb-6">
              Uygulama beklenmedik bir hata ile karşılaştı. Sayfayı yenileyerek tekrar deneyebilirsin.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-[#14B8A6] text-white text-sm font-bold active:scale-[0.97] transition-transform"
            >
              Sayfayı Yenile
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-4 text-left text-xs text-[#E94560] bg-[#E94560]/10 rounded-xl p-3 overflow-auto">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
