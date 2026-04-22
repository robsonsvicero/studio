import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';

export function Logo({ className, textClassName }: { className?: string; textClassName?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Home className="h-8 w-8 text-accent" />
      <span className={cn('text-2xl font-bold text-primary tracking-tight', textClassName)}>
        André Barbosa <span className="font-light">Imóveis</span>
      </span>
    </Link>
  );
}
