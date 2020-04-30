import React, { createContext, useContext, useCallback, useState } from 'react';
import { uuid } from 'uuidv4';

import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  // utilizar no toastContainer, por isso o export interface
  id: string; // map precisa do key
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    // todas as propriedades do toastmassage, menos o id
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      const id = uuid();

      const toast = {
        id,
        type,
        title,
        description,
      };
      // oldmessages === state
      // quando faz set em qualquer tipo de estado do react,
      // e depende do item anterior do valor para preencher o estado
      // em vez de passar o valor novo do estado, se vc passar uma função, recebe o valorantigo(oldmessages / state)
      // dai da pra retornar as mensagens anteriores (...messages), e a nova mensagem(toast))
      setMessages((oldMessages) => [...messages, toast]);
    },
    // eslint-disable-next-line
    [],
  );

  const removeToast = useCallback((id: string) => {
    // pegou o estado atual das mensagens, fazer um filtro no estado, retornando
    // as mensagens com filtro aplicado (pegar cada uma das mensagens, e quero as mensagens no qual o id for diferente no qual eu recebi)
    // ou seja, vai retornar todas as mensagens que tem armazenada no estado, menos aquela que eu peguei pelo id no callback
    setMessages((state) => state.filter((message) => message.id !== id));
    // eslint-disable-next-line
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
