import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="w-16 h-16 text-red-500" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We encountered an unexpected error. Please try refreshing the
                page.
              </p>

              {this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Error details
                  </summary>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <button
                onClick={this.handleRetry}
                className="
                  inline-flex items-center space-x-2
                  px-4 py-2 
                  bg-blue-600 hover:bg-blue-700 
                  text-white 
                  rounded-lg 
                  font-medium 
                  transition-colors
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:ring-offset-2
                  dark:focus:ring-offset-gray-800
                "
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
