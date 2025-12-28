import * as yup from 'yup';

export const phoneValidation = yup
  .string()
  .nullable()
  .test('phone-format', 'Некорректный номер телефона,+7(###)###-##-##', function (value) {
    if (!value) return true;

    const digits = value.replace(/\D/g, '');

    if (digits.length !== 11 || !digits.startsWith('7')) {
      return false;
    }

    return true;
  })
  .notRequired();

export const phoneValidationRequired = yup
  .string()
  .required('Введите номер телефона')
  .test('phone-format', 'Некорректный номер телефона, +7(###)###-##-##', function (value) {
    if (!value) return false;

    const digits = value.replace(/\D/g, '');
    return digits.length === 11 && digits.startsWith('7');
  });
