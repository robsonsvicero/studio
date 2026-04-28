import { adminDb } from '@/lib/firebase/admin';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// Tell Next.js to dynamically render this page on every request
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let properties: any[] = [];
  
  try {
    const snapshot = await adminDb.collection('properties').orderBy('createdAt', 'desc').get();
    properties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching properties', error);
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
                      <Link href={`/admin/properties/${prop.id}/edit`}>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      {/* Note: Delete action should be implemented as a client form/action */}
                      <form action={async () => {
                        'use server';
                        await adminDb.collection('properties').doc(prop.id).delete();
                        // revalidate or redirect here in a real server action
                      }}>
                        <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
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
