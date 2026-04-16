import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

// React error boundary — catches runtime errors in descendants and renders
// a friendly fallback instead of a white screen.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, send to Sentry or similar here.
    if (typeof console !== "undefined") {
      console.error("[Vikingo ErrorBoundary]", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const msg = this.state.error?.message || String(this.state.error || "Unknown error");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-sm text-gray-600 mb-4">
            The app hit an unexpected error. Nothing was lost — your data is safe. You can try
            again, reload the page, or go back to the dashboard.
          </p>

          <details className="text-left bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5">
            <summary className="text-xs font-semibold text-gray-600 cursor-pointer">Technical details</summary>
            <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-40">{msg}</pre>
          </details>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={this.handleReset}
              className="flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
            >
              <RefreshCw size={14} /> Try again
            </button>
            <button
              onClick={this.handleReload}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold"
            >
              Reload page
            </button>
            <a
              href="/"
              className="flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
            >
              <Home size={14} /> Home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
