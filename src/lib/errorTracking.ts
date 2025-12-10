type ErrorSeverity = 'error' | 'warning' | 'info' | 'fatal';

interface ErrorContext {
  [key: string]: any;
}

class ErrorTrackingService {
  private enabled: boolean;
  private userId: string | null = null;

  constructor() {
    this.enabled = import.meta.env.PROD;
    this.setupGlobalErrorHandler();
  }

  private setupGlobalErrorHandler() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.captureException(event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(event.reason, {
        type: 'unhandledrejection',
        promise: event.promise,
      });
    });
  }

  setUser(userId: string | null, email?: string, username?: string) {
    this.userId = userId;

    if (this.enabled && userId) {
    }
  }

  captureException(error: Error | unknown, context?: ErrorContext, severity: ErrorSeverity = 'error') {
    if (!this.enabled) {
      console.error('[Error Tracking]', error, context);
      return;
    }

    try {
      const errorData = {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        severity,
        context,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      };

      console.error('[Error Tracking]', errorData);

      this.logToBackend(errorData);
    } catch (err) {
      console.error('[Error Tracking] Failed to capture exception:', err);
    }
  }

  captureMessage(message: string, context?: ErrorContext, severity: ErrorSeverity = 'info') {
    if (!this.enabled) {
      console.log('[Error Tracking]', message, context);
      return;
    }

    try {
      const messageData = {
        message,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        severity,
        context,
      };

      this.logToBackend(messageData);
    } catch (err) {
      console.error('[Error Tracking] Failed to capture message:', err);
    }
  }

  private async logToBackend(data: any) {
    try {
      if (!this.enabled) return;

    } catch (error) {
      console.error('[Error Tracking] Failed to log to backend:', error);
    }
  }

  addBreadcrumb(message: string, category: string, data?: ErrorContext) {
    if (!this.enabled) return;

    try {
      const breadcrumb = {
        message,
        category,
        data,
        timestamp: new Date().toISOString(),
      };

      console.log('[Breadcrumb]', breadcrumb);
    } catch (error) {
      console.error('[Error Tracking] Failed to add breadcrumb:', error);
    }
  }
}

export const errorTracking = new ErrorTrackingService();

export const withErrorBoundary = <T extends (...args: any[]) => any>(
  fn: T,
  context?: ErrorContext
): T => {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);

      if (result instanceof Promise) {
        return result.catch((error) => {
          errorTracking.captureException(error, {
            ...context,
            functionName: fn.name,
            args,
          });
          throw error;
        });
      }

      return result;
    } catch (error) {
      errorTracking.captureException(error, {
        ...context,
        functionName: fn.name,
        args,
      });
      throw error;
    }
  }) as T;
};
