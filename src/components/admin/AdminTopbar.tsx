'use client';

import { useAdminAuth } from '@/lib/admin-auth-context';
import { Menu, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { session, logout } = useAdminAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/admin/login');
  };

  const initials = session?.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'A';

  return (
    <header className="h-16 bg-zinc-950 border-b border-zinc-800/60 flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-zinc-400 hover:text-white">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
        </button>

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors"
          >
            <div className="w-8 h-8 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white leading-tight">{session?.user.name}</p>
              <p className="text-[11px] text-zinc-500 leading-tight capitalize">{session?.user.role}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-500 hidden sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1 z-50">
              <div className="px-3 py-2 border-b border-zinc-800 sm:hidden">
                <p className="text-sm font-medium text-white">{session?.user.name}</p>
                <p className="text-xs text-zinc-500 capitalize">{session?.user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-800/60 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
