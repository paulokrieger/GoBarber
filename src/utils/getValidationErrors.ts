import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string; // essa parte esquerda do lado pode ser qualquer coisa, porém ter que ser uma string
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message; // isso veio do retorno de um erro do yup
  });

  return validationErrors;
}
