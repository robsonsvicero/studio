'use client';

import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building, Plus, LogOut, Loader2, MessageSquare, Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/api-utils';
import { ContactsProvider, useContacts } from '@/contexts/contacts-context';

function AdminSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { unreadCount, setUnreadCount } = useContacts();
  const [isOpen, setIsOpen] = useState(false);

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
      } catch (error) {}
    }

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [user, setUnreadCount]);

  // Fecha o menu ao navegar
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/contacts', label: 'Contatos', icon: MessageSquare, badge: unreadCount },
    { href: '/admin/properties/new', label: 'Novo Imóvel', icon: Plus },
    { href: '/', label: 'Ver Site', icon: Building },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0">
        <span className="font-bold text-xl tracking-tight">Admin<span className="text-primary">Panel</span></span>
        {/* Botão fechar — só mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1 rounded-md text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span className={cn(
              "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}>
              <span className="flex items-center">
                <item.icon className={cn("mr-3 h-5 w-5", pathname === item.href ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </span>
              {item.badge > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-orange-500 text-white">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t flex-shrink-0">
        <div className="mb-4 px-3 text-sm text-muted-foreground truncate">{user?.email}</div>
        <Button variant="outline" className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Botão hambúrguer — só mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-background border shadow-sm text-foreground",
          isOpen && "hidden"
        )}
      >
        <Menu size={20} />
      </button>

      {/* Overlay — só mobile quando aberto */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar — fixo no desktop, flutuante no mobile */}
      <aside className={cn(
        "fixed md:relative inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col transition-transform duration-300",
        "md:translate-x-0 md:flex",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <SidebarContent />
      </aside>
    </>
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
          <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-16 md:pt-8">
            {children}
          </div>
        </main>
      </div>
    </ContactsProvider>
  );
}
