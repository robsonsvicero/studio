'use client';

import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building, Plus, LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not loading and no user, middleware should have redirected. But just in case:
  if (!user) {
    return null; 
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Novo Imóvel', href: '/admin/properties/new', icon: Plus },
    { name: 'Ver Site', href: '/', icon: Building },
  ];

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-bold text-xl tracking-tight">Admin<span className="text-primary">Panel</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <span className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                  <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <div className="mb-4 px-3 text-sm text-muted-foreground truncate">
            {user.email}
          </div>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
