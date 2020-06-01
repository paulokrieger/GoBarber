import React, { useEffect } from 'react';

import {
  FiAlertCircle,
  FiXCircle,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';
import { ToastMessage, useToast } from '../../../hooks/toast';
import { Container } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  // effect para o toast desaparecer após 3s
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    // botou na variavel timer pq se antes do 3s, se o usuario fechar a tela, nao vai ter mais toast pra fechar
    // ou seja, tem que fazer de uma forma que se ele fizer isso, ele cancele o timer
    // se retornar dentro do useeffect uma função essa função vai ser automaticamente executada se o componente deixar de existir

    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, message.id]);
  return (
    <Container
      type={message.type}
      hasDescription={Number(!!message.description)} // true 1 false 0
      style={style}
    >
      {icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button onClick={() => removeToast(message.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
