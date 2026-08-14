import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#121212', color: 'red', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>🚨 FATAL REACT ERROR 🚨</h2>
          <p><strong>Error:</strong> {this.state.error?.toString()}</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', color: '#ff8888' }}>
            <summary>Stack Trace (Click to expand)</summary>
            {this.state.errorInfo?.componentStack}
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '2rem', padding: '0.5rem 1rem', background: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
