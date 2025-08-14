/**
 * Error Context for Global Error Handling
 */

import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorDisplay } from '../components/ErrorDisplay';

const ErrorContext = createContext<ReturnType<typeof useErrorHandler> | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const errorHandler = useErrorHandler();

  return (
    <ErrorContext.Provider value={errorHandler}>
      {children}
      <ErrorDisplay
        errors={errorHandler.errors}
        onDismiss={errorHandler.removeError}
        onRetry={errorHandler.retryError}
        onClearAll={errorHandler.clearErrors}
      />
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};