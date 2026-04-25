'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Throwing the error will cause it to be caught by Next.js's development error overlay.
      // This is only for development and should be handled differently in production.
      if (process.env.NODE_ENV === 'development') {
        throw error;
      } else {
        // In production, you might want to log to a service like Sentry
        console.error('Firestore Permission Error:', error);
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null;
}
