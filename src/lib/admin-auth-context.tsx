'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AdminSession {
    user: AdminUser;
    loggedInAt: string;
}

interface AdminAuthContextType {
    session: AdminSession | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<AdminSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check session on mount via server
    useEffect(() => {
        fetch('/api/admin/auth')
            .then(r => r.json())
            .then(data => {
                if (data.authenticated) {
                    // Restore session from localStorage for user info display
                    try {
                        const stored = localStorage.getItem('beneera_admin_session');
                        if (stored) setSession(JSON.parse(stored));
                    } catch {}
                } else {
                    localStorage.removeItem('beneera_admin_session');
                    setSession(null);
                }
            })
            .catch(() => {
                setSession(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                const newSession: AdminSession = {
                    user: data.user,
                    loggedInAt: new Date().toISOString(),
                };
                setSession(newSession);
                localStorage.setItem('beneera_admin_session', JSON.stringify(newSession));
                return { success: true };
            }
            return { success: false, error: data.error || 'Login failed' };
        } catch {
            return { success: false, error: 'Network error' };
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/admin/auth', { method: 'DELETE' });
        } catch {}
        setSession(null);
        localStorage.removeItem('beneera_admin_session');
    };

    return (
        <AdminAuthContext.Provider value={{ session, isLoading, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
    return context;
}

export type { AdminSession, AdminUser };
