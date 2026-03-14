'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Auto-report to error log API
        fetch('/api/error-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                level: 'error',
                source: 'client',
                message: `[GlobalError] ${error.message}`,
                stack: error.stack,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
                meta: { digest: error.digest },
            }),
        }).catch(() => {});
    }, [error]);

    return (
        <html>
            <body>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
                    <div style={{ textAlign: 'center', maxWidth: 400 }}>
                        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Something went wrong</h2>
                        <p style={{ color: '#a1a1aa', fontSize: 14, marginBottom: 24 }}>An unexpected error occurred. Our team has been notified.</p>
                        <button onClick={reset} style={{ padding: '10px 24px', background: '#f59e0b', color: '#0a0a0a', fontWeight: 600, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
                            Try Again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
