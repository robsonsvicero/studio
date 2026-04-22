import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';

export function Logo({ className, textClassName }: { className?: string; textClassName?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Building2 className="h-8 w-8 text-accent" />
      <div className="flex flex-col leading-tight">
        <span className={cn('text-xl font-bold text-primary tracking-tight uppercase', textClassName)}>
          André Barbosa
        </span>
        <span className={cn('text-[10px] text-primary tracking-widest uppercase', textClassName)}>
          Negócios Imobiliários
        </span>
      </div>
    </Link>
  );
}
