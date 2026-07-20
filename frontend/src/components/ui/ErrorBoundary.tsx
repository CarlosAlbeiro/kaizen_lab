import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-6 text-center">
          <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight">¡Oops! Algo salió mal</h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            Ocurrió un error al intentar cargar la información. Por favor, intenta recargar la
            página.
          </p>
          {this.state.error && (
            <div className="mb-6 max-w-xl overflow-auto rounded-lg bg-black/40 p-4 text-left text-xs font-mono text-muted-foreground border border-white/10">
              {this.state.error.message}
            </div>
          )}
          <Button
            onClick={this.handleRetry}
            className="gap-2 bg-[var(--gradient-primary)] text-primary-foreground shadow-glow"
          >
            <RotateCcw className="h-4 w-4" /> Intentar de nuevo
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
