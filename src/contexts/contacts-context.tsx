'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ContactsContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  decrementUnread: () => void;
}

const ContactsContext = createContext<ContactsContextType>({
  unreadCount: 0,
  setUnreadCount: () => {},
  decrementUnread: () => {},
});

export function ContactsProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const decrementUnread = useCallback(() => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  return (
    <ContactsContext.Provider value={{ unreadCount, setUnreadCount, decrementUnread }}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  return useContext(ContactsContext);
}
