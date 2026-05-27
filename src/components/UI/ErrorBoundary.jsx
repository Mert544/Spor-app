import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('dynamically imported module');
    return { hasError: true, isChunkError };
  }

  handleRetry = () => {
    this.setState({ hasError: false, isChunkError: false });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-xs">
          <div className="text-4xl mb-4">
            {this.state.isChunkError ? '📡' : '⚠️'}
          </div>
          <h2 className="text-lg font-bold text-white mb-2">
            {this.state.isChunkError
              ? 'Sayfa yüklenemedi'
              : 'Bir hata olustu'}
          </h2>
          <p className="text-sm text-white/50 mb-6">
            {this.state.isChunkError
              ? 'Internet baglantini kontrol edip tekrar dene.'
              : 'Beklenmeyen bir hata olustu. Sayfayi yenilemeyi dene.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="px-6 py-3 bg-[#14B8A6] text-white font-semibold rounded-xl active:scale-95 transition-transform"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }
}
