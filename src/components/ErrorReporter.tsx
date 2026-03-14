'use client';

import { useEffect } from 'react';

/**
 * Client-side error reporter — catches unhandled errors and promise rejections,
 * then POSTs them to /api/admin/error-logs.
 * 
 * Mount once in the root layout.
 */
export default function ErrorReporter() {
    useEffect(() => {
        function report(data: Record<string, unknown>) {
            fetch('/api/error-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    level: 'error',
                    source: 'client',
                    url: window.location.href,
                    ...data,
                }),
            }).catch(() => {});
        }

        function onError(event: ErrorEvent) {
            report({
                message: event.message || 'Unhandled client error',
                stack: event.error?.stack,
                meta: { filename: event.filename, lineno: event.lineno, colno: event.colno },
            });
        }

        function onUnhandledRejection(event: PromiseRejectionEvent) {
            const reason = event.reason;
            report({
                message: reason?.message || String(reason) || 'Unhandled promise rejection',
                stack: reason?.stack,
            });
        }

        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onUnhandledRejection);

        return () => {
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onUnhandledRejection);
        };
    }, []);

    return null;
}
