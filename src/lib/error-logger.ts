import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface LogErrorOptions {
    level?: 'error' | 'warn' | 'info';
    source?: 'server' | 'client' | 'api' | 'auth' | 'payment' | 'email' | 'cron';
    message: string;
    stack?: string;
    url?: string;
    method?: string;
    statusCode?: number;
    userAgent?: string;
    ip?: string;
    meta?: Record<string, unknown>;
}

/**
 * Log an error to the database ErrorLog table.
 * Non-blocking — will not throw if logging fails.
 */
export async function logError(opts: LogErrorOptions): Promise<void> {
    try {
        await prisma.errorLog.create({
            data: {
                level: opts.level || 'error',
                source: opts.source || 'server',
                message: opts.message.slice(0, 2000),
                stack: opts.stack?.slice(0, 5000) || null,
                url: opts.url?.slice(0, 1000) || null,
                method: opts.method || null,
                statusCode: opts.statusCode || null,
                userAgent: opts.userAgent?.slice(0, 500) || null,
                ip: opts.ip || null,
                meta: (opts.meta as Prisma.InputJsonValue) ?? undefined,
            },
        });
    } catch {
        // Silently fail — don't let error logging break the app
        console.error('[ErrorLog] Failed to write error log:', opts.message);
    }
}

/**
 * Helper to extract error info from a caught exception and request
 */
export function logApiError(err: unknown, req?: Request, extra?: Partial<LogErrorOptions>): Promise<void> {
    const error = err instanceof Error ? err : new Error(String(err));
    return logError({
        level: 'error',
        source: 'api',
        message: error.message,
        stack: error.stack,
        url: req?.url,
        method: req?.method,
        userAgent: req?.headers?.get('user-agent') || undefined,
        ...extra,
    });
}
