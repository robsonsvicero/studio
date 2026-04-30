'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Calendar, User, MessageSquare, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getApiUrl } from '@/lib/api-utils';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const response = await fetch(getApiUrl('/api/admin/contacts'));
      const data = await response.json();
      if (Array.isArray(data)) {
        setContacts(data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contatos Recebidos</h1>
          <p className="text-muted-foreground">Gerencie as mensagens enviadas pelos clientes através do site.</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Total: {contacts.length}
        </Badge>
      </div>

      {contacts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="p-4 bg-muted rounded-full mb-4">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Nenhuma mensagem ainda</CardTitle>
          <CardDescription>As mensagens enviadas pelo formulário do rodapé aparecerão aqui.</CardDescription>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-primary" />
                      <h3 className="font-bold text-lg">{contact.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail size={14} />
                      <a href={`mailto:${contact.email}`} className="hover:text-primary hover:underline transition-colors">
                        {contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={14} />
                      {format(new Date(contact.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" asChild>
                      <a href={`mailto:${contact.email}`}>Responder por E-mail</a>
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-muted">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                    <MessageSquare size={12} />
                    Mensagem Original
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {contact.message}
                  </p>
                </div>

                {contact.aiSummary && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-1">
                      Resumo da IA (Concierge)
                    </div>
                    <p className="text-xs italic text-primary/80 italic">
                      {contact.aiSummary}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Badge({ children, variant, className }: any) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
      variant === 'outline' ? 'border text-foreground' : 'bg-primary text-primary-foreground'
    } ${className}`}>
      {children}
    </span>
  );
}
