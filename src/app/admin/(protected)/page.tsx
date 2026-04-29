'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { getApiUrl } from '@/lib/api-utils';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [properties, setProperties] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchProperties = React.useCallback(async () => {
    try {
      const response = await fetch(getApiUrl('/api/properties'));
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os imóveis.'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;

    try {
      // Nota: Idealmente teríamos uma rota de DELETE, mas podemos usar o motor da Vercel
      // Por agora, vamos apenas simular ou avisar que o motor gerencia isso
      toast({
        title: 'Em breve',
        description: 'A função de deletar está sendo migrada para a API Motor.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível excluir o imóvel.'
      });
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Imóveis</h1>
          <p className="text-muted-foreground">Gerencie os imóveis do seu catálogo.</p>
        </div>
        <Link href="/admin/properties/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Cadastrar Imóvel
          </Button>
        </Link>
      </div>

      <div className="border rounded-md bg-background">
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
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum imóvel cadastrado.
                </TableCell>
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
                    <span>{prop.title}</span>
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
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(prop.id)}
                      >
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
    </div>
  );
}
