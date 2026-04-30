'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2, Building2, MessageSquare, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { getApiUrl } from '@/lib/api-utils';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [properties, setProperties] = React.useState<any[]>([]);
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchData = React.useCallback(async () => {
    try {
      const [propsRes, contactsRes] = await Promise.all([
        fetch(getApiUrl('/api/properties')),
        fetch(getApiUrl('/api/admin/contacts')),
      ]);

      if (propsRes.ok) {
        const data = await propsRes.json();
        setProperties(data);
      }

      if (contactsRes.ok) {
        const data = await contactsRes.json();
        if (Array.isArray(data)) setContacts(data);
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível carregar os dados.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const unreadContacts = contacts.filter(c => c.status !== 'read').length;

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;
    toast({ title: 'Em breve', description: 'A função de deletar está sendo migrada para a API.' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Card Imóveis */}
        <Link href="/admin">
          <div className="bg-background border rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 rounded-full bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Imóveis Cadastrados</p>
              <p className="text-3xl font-bold">{properties.length}</p>
            </div>
          </div>
        </Link>

        {/* Card Contatos */}
        <Link href="/admin/contacts">
          <div className={`bg-background border rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${unreadContacts > 0 ? 'border-orange-300 bg-orange-50/30' : ''}`}>
            <div className={`p-3 rounded-full ${unreadContacts > 0 ? 'bg-orange-100' : 'bg-primary/10'}`}>
              <MessageSquare className={`h-6 w-6 ${unreadContacts > 0 ? 'text-orange-500' : 'text-primary'}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total de Contatos</p>
              <p className="text-3xl font-bold">{contacts.length}</p>
            </div>
            {unreadContacts > 0 && (
              <div className="flex flex-col items-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white text-xs font-bold rounded-full animate-pulse">
                  <AlertCircle size={12} />
                  {unreadContacts} novos
                </span>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Tabela de Imóveis */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Imóveis</h1>
          <p className="text-muted-foreground text-sm">Gerencie os imóveis do seu catálogo.</p>
        </div>
        <Link href="/admin/properties/new">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Novo Imóvel
          </Button>
        </Link>
      </div>

      {/* Tabela — desktop */}
      <div className="hidden md:block border rounded-md bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imóvel</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">Nenhum imóvel cadastrado.</TableCell>
              </TableRow>
            ) : (
              properties.map((prop) => (
                <TableRow key={prop.id}>
                  <TableCell className="font-medium flex items-center space-x-3">
                    <div className="w-12 h-12 relative rounded overflow-hidden bg-muted flex-shrink-0">
                      {prop.images && prop.images.length > 0 ? (
                        <Image src={prop.images[0]} alt={prop.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sem foto</div>
                      )}
                    </div>
                    <span className="line-clamp-1">{prop.title}</span>
                  </TableCell>
                  <TableCell>{prop.propertyType || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={prop.transactionType === 'Venda' ? 'default' : 'secondary'}>
                      {prop.transactionType || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.price || 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/properties/edit?id=${prop.id}`}>
                        <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                      </Link>
                      <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(prop.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden grid gap-3">
        {properties.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 border rounded-xl bg-background">Nenhum imóvel cadastrado.</div>
        ) : (
          properties.map((prop) => (
            <div key={prop.id} className="bg-background border rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {prop.images && prop.images.length > 0 ? (
                  <Image src={prop.images[0]} alt={prop.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sem foto</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm line-clamp-1">{prop.title}</p>
                <p className="text-xs text-muted-foreground">{prop.propertyType || 'N/A'}</p>
                <p className="text-sm font-bold text-primary mt-1">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.price || 0)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/admin/properties/edit?id=${prop.id}`}>
                  <Button variant="outline" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                </Link>
                <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(prop.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
