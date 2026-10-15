import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Creator Growth System caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070709] text-[#F5F3EF] p-10 font-mono text-sm">
          <div className="max-w-2xl mx-auto rounded-2xl border border-red-500/30 bg-red-950/20 p-6">
            <h2 className="text-xl font-bold text-red-400 mb-2">Application Interface Exception</h2>
            <p className="text-neutral-400 text-xs mb-4">An unexpected render issue was caught by the boundary.</p>
            <pre className="overflow-auto text-xs bg-black/60 p-4 rounded-lg text-red-300">
              {this.state.error?.stack || this.state.error?.toString()}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-4 px-4 py-2 rounded-full bg-[#D4AF37] text-black font-semibold text-xs"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
