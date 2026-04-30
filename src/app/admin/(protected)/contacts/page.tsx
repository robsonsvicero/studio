'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Calendar, User, MessageSquare, Loader2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getApiUrl } from '@/lib/api-utils';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    try {
      const response = await fetch(getApiUrl('/api/admin/contacts'));
      const data = await response.json();
      if (Array.isArray(data)) {
        const sortedData = data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setContacts(sortedData);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja apagar este contato?')) return;
    
    setProcessingId(id);
    try {
      const response = await fetch(getApiUrl(`/api/admin/contacts?id=${id}`), {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        setContacts(contacts.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setProcessingId(null);
    }
  }

  async function handleMarkRead(id: string, currentStatus: string) {
    if (currentStatus === 'read') return;
    
    try {
      const response = await fetch(getApiUrl(`/api/admin/contacts?id=${id}`), {
        method: 'PATCH'
      });
      const result = await response.json();
      if (result.success) {
        setContacts(contacts.map(c => 
          c.id === id ? { ...c, status: 'read' } : c
        ));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }

  const unreadCount = contacts.filter(c => c.status !== 'read').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contatos e Leads</h1>
          <p className="text-muted-foreground">Gerencie as mensagens e oportunidades recebidas.</p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="px-4 py-1.5 h-auto text-sm">
            Total: {contacts.length}
          </Badge>
          {unreadCount > 0 && (
            <Badge variant="default" className="px-4 py-1.5 h-auto text-sm bg-orange-500 hover:bg-orange-600 animate-pulse">
              <AlertCircle size={14} className="mr-1" />
              {unreadCount} Novos
            </Badge>
          )}
        </div>
      </div>

      {contacts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="p-4 bg-muted rounded-full mb-4">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Nenhuma mensagem ainda</CardTitle>
          <CardDescription>As mensagens enviadas pelo formulário aparecerão aqui instantaneamente.</CardDescription>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <Card 
              key={contact.id} 
              onMouseEnter={() => handleMarkRead(contact.id, contact.status)}
              onClick={() => handleMarkRead(contact.id, contact.status)}
              className={`overflow-hidden transition-all duration-300 border-l-4 cursor-pointer ${
                contact.status === 'read' 
                  ? 'border-l-muted opacity-80' 
                  : 'border-l-orange-500 shadow-md ring-1 ring-orange-100 bg-orange-50/10'
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User size={16} className={contact.status === 'read' ? 'text-muted-foreground' : 'text-orange-500'} />
                      <h3 className="font-bold text-lg">{contact.name}</h3>
                      {contact.status !== 'read' && (
                        <Badge variant="default" className="bg-orange-500 text-[10px] py-0 px-1.5">NOVO</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail size={14} />
                        <a href={`mailto:${contact.email}`} className="hover:text-primary hover:underline transition-colors">
                          {contact.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={14} />
                        {(() => {
                          try {
                            return format(new Date(contact.createdAt), "dd 'de' MMM, HH:mm", { locale: ptBR });
                          } catch (e) {
                            return 'Data indisponível';
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${contact.email}`}>Responder</a>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contact.id);
                      }}
                      disabled={processingId === contact.id}
                    >
                      {processingId === contact.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg border border-muted/50">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                      <MessageSquare size={12} />
                      Mensagem do Cliente
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap italic text-muted-foreground">
                      "{contact.message}"
                    </p>
                  </div>

                  {contact.aiSummary && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2 flex items-center gap-2">
                        <CheckCircle2 size={12} />
                        Resumo da IA (Concierge)
                      </div>
                      <p className="text-sm text-primary/80">
                        {contact.aiSummary}
                      </p>
                    </div>
                  )}
                </div>
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
      variant === 'outline' ? 'border text-foreground bg-background' : 'bg-primary text-primary-foreground'
    } ${className}`}>
      {children}
    </span>
  );
}
