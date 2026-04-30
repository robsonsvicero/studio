'use client';

import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building, Plus, LogOut, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { getApiUrl } from '@/lib/api-utils';
import { ContactsProvider, useContacts } from '@/contexts/contacts-context';

function AdminSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { unreadCount, setUnreadCount } = useContacts();

  useEffect(() => {
    if (!user) return;

    async function fetchUnreadCount() {
      try {
        const response = await fetch(getApiUrl('/api/admin/contacts'));
        const data = await response.json();
        if (Array.isArray(data)) {
          const count = data.filter((c: any) => c.status !== 'read').length;
          setUnreadCount(count);
        }
      } catch (error) {
        // Falha silenciosa — não travar o layout
      }
    }

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [user, setUnreadCount]);

  return (
    <aside className="w-64 bg-background border-r flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <span className="font-bold text-xl tracking-tight">Admin<span className="text-primary">Panel</span></span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {/* Dashboard */}
        <Link href="/admin">
          <span className={cn(
            "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
            pathname === '/admin' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}>
            <Home className={cn("mr-3 h-5 w-5", pathname === '/admin' ? "text-primary" : "text-muted-foreground")} />
            Dashboard
          </span>
        </Link>

        {/* Contatos — com badge em tempo real */}
        <Link href="/admin/contacts">
          <span className={cn(
            "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
            pathname === '/admin/contacts' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}>
            <span className="flex items-center">
              <MessageSquare className={cn("mr-3 h-5 w-5", pathname === '/admin/contacts' ? "text-primary" : "text-muted-foreground")} />
              Contatos
            </span>
            {unreadCount > 0 && (
              <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-orange-500 text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </span>
        </Link>

        {/* Novo Imóvel */}
        <Link href="/admin/properties/new">
          <span className={cn(
            "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
            pathname === '/admin/properties/new' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}>
            <Plus className={cn("mr-3 h-5 w-5", pathname === '/admin/properties/new' ? "text-primary" : "text-muted-foreground")} />
            Novo Imóvel
          </span>
        </Link>

        {/* Ver Site */}
        <Link href="/">
          <span className={cn(
            "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
            pathname === '/' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}>
            <Building className={cn("mr-3 h-5 w-5", pathname === '/' ? "text-primary" : "text-muted-foreground")} />
            Ver Site
          </span>
        </Link>
      </nav>
      <div className="p-4 border-t">
        <div className="mb-4 px-3 text-sm text-muted-foreground truncate">
          {user?.email}
        </div>
        <Button variant="outline" className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <ContactsProvider>
      <div className="flex min-h-screen bg-muted/20">
        <AdminSidebar />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </ContactsProvider>
  );
}
