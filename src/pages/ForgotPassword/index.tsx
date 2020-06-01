import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({}); // zerando os erros
        // schema de validacao -> os dados que vao ser validados é um objeto(object) com a forma de(shape){}
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });

        // rec de senha
        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'Email de recuperação enviado.',
          description:
            'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada',
        });

        await schema.validate(data, {
          abortEarly: false, // vai retornar todos os erros de uma vez só, e nao o primeiro erro q ele encontrar
        });
      } catch (err) {
        // ser o erro for um erro gerado pela validação do yup
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }
      } finally {
        setLoading(false);
        // disparar toast
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente',
        });
      }
    },
    [addToast],
  );
  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={logoImg} alt="GoBarber" />
            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Recuperar senha</h1>
              <Input name="email" icon={FiMail} placeholder="E-mail" />
              <Button loading={loading} type="submit">
                Recuperar
              </Button>
            </Form>
            <Link to="/">
              <FiLogIn />
              Voltar ao login
            </Link>
          </AnimationContainer>
        </Content>
        <Background />
      </Container>
    </>
  );
};

export default ForgotPassword;
