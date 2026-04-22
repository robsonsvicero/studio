'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Bot, MessageCircle, Send, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { askAiAssistant } from '@/app/actions';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const initialState = {
  message: null,
  error: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" aria-disabled={pending} disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      <span className="sr-only">Enviar</span>
    </Button>
  );
}

export function AiChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou seu assistente imobiliário. Como posso ajudar a encontrar o imóvel ideal em São Paulo para você hoje?',
    },
  ]);
  const [formState, formAction] = useFormState(askAiAssistant, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (formState.message) {
      if (formState.error) {
        toast({
          variant: 'destructive',
          title: 'Erro no Assistente',
          description: formState.message,
        });
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: formState.message! }]);
      }
    }
  }, [formState, toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleFormSubmit = async (formData: FormData) => {
    const question = formData.get('question') as string;
    if (question && question.trim().length > 0) {
      setMessages((prev) => [...prev, { role: 'user', content: question }]);
      formAction(formData);
      formRef.current?.reset();
    }
  };

  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-accent hover:bg-accent/90"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-7 w-7" />
        <span className="sr-only">Abrir assistente de IA</span>
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Bot /> Assistente Virtual
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-grow my-4 pr-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-lg p-3 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <p>{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div id="anchor" />
            </div>
          </ScrollArea>
          <SheetFooter>
            <form ref={formRef} action={handleFormSubmit} className="flex w-full items-center gap-2">
              <Input
                name="question"
                placeholder="Pergunte sobre um imóvel..."
                autoComplete="off"
              />
              <SubmitButton />
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
