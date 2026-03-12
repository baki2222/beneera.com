import { AdminUser } from '@/lib/admin-types';

export const adminUsers: AdminUser[] = [
  { id: 'usr_001', name: 'Aabid Billah', email: 'admin@beneera.com', role: 'owner', active: true, lastLogin: '2026-03-11T20:00:00Z', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'usr_002', name: 'Nadia Rahman', email: 'nadia@beneera.com', role: 'admin', active: true, lastLogin: '2026-03-11T15:30:00Z', createdAt: '2025-06-15T10:00:00Z' },
  { id: 'usr_003', name: 'Jake Cooper', email: 'jake@beneera.com', role: 'staff', active: true, lastLogin: '2026-03-10T09:00:00Z', createdAt: '2025-11-01T14:00:00Z' },
];

export function getUserById(id: string): AdminUser | undefined {
  return adminUsers.find((u) => u.id === id);
}

export function validateLogin(email: string, password: string): AdminUser | null {
  if (password === 'admin123') {
    const user = adminUsers.find((u) => u.email === email && u.active);
    return user || null;
  }
  return null;
}
