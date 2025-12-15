import React, { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SafeSection extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `SafeSection [${this.props.sectionName || 'Unknown'}] caught error:`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400 font-semibold">
              {this.props.fallbackMessage || 'Erro ao carregar seção'}
            </p>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-2 text-left">
              <summary className="cursor-pointer text-xs text-red-300 mb-1">
                Detalhes (dev)
              </summary>
              <pre className="text-xs text-red-300 overflow-auto max-h-20">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
