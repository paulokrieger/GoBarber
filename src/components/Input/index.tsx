import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons'; // propriedades que um icone pode ter
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core'; // hook disponível que recebe como parametro o nome do campo
import { Container, Error } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>; // receber um componente como propriedade, passando as propriedades dos ícones
}
// recebe todas as props do input e passando para ele
// linha 14: se houver ícone
const Input: React.FC<InputProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  // se acessar inputref agora, vai ter acesso ao elemento desse input na DOM,
  // manipular de forma direta, botar focus, .value .. como se tivesse JS tradicional
  // ou jquery para fazer uma manipulacao direta a algum elemento

  const [isFocused, setisFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null); // tipando o input
  // registerField -> registro que vc precisa fazer desse
  // defaultValue -> quando quer que algum valor do input venha como padrão e no Form passando initialData={{ name: 'Paulo' }}
  // name nesse caso eh o nome do input
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputBlur = useCallback(() => {
    setisFocused(false);
    setIsFilled(!!inputRef.current?.value);
    /** Acima = mesma coisa do que abaixo
        if (inputRef.current?.value) {
          setIsFilled(true);
        } { else
          setIsFilled(false)
        };

      }
       */
  }, []);

  const handleInputFocus = useCallback(() => {
    setisFocused(true);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value', // onde o unform, dentro dessa referencia, vai buscar o valor do input
    });
  }, [fieldName, registerField]);
  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isFilled={isFilled}
      isFocused={isFocused}
    >
      {Icon && <Icon size={20} />}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Input;
