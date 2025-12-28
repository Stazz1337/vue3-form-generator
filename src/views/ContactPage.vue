<template>
  <div class="contact-page page-container">
    <div class="form-section">
      <FormGenerator
        ref="formRef"
        :fields="fields"
        :initial-values="formData"
        submit-button-text="Отправить сообщение"
        cancel-button-text="Очистить форму"
        @submit="onSubmit"
        @cancel="onCancel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import * as yup from 'yup';
import { phoneValidationRequired } from '@/utils/phoneValidation';
import FormGenerator from '@/components/FormGenerator.vue';
import type { FormField } from '@/components/FormGenerator.vue';

const store = useStore();

const formRef = ref<InstanceType<typeof FormGenerator> | null>(null);

const formData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  contactMethod: 'email',
  message: '',
  agreeToPrivacy: false,
};

const fields: FormField[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Ваше имя',
    required: true,
    attrs: { placeholder: 'Иван Иванов' },
    validation: yup
      .string()
      .required('Введите ваше имя')
      .min(2, 'Минимум 2 символа')
      .max(50, 'Максимум 50 символов'),
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    required: true,
    attrs: { placeholder: 'ivan@example.com' },
    validation: yup.string().email('Некорректный email').required('Email обязателен'),
  },
  {
    name: 'phone',
    type: 'text',
    label: 'Телефон',
    required: true,
    mask: 'phone',
    attrs: {
      placeholder: '+7 (999) 123-45-67',
      maxlength: 18,
    },
    validation: phoneValidationRequired,
  },
  {
    name: 'company',
    type: 'text',
    label: 'Компания',
    attrs: { placeholder: 'ООО "Название компании"' },
    validation: yup.string().nullable().max(100, 'Максимум 100 символов').notRequired(),
  },
  {
    name: 'contactMethod',
    type: 'select',
    label: 'Предпочтительный способ связи',
    required: true,
    options: [
      { value: 'email', label: 'Email' },
      { value: 'phone', label: 'Телефон' },
      { value: 'telegram', label: 'Telegram' },
      { value: 'whatsapp', label: 'WhatsApp' },
    ],
    validation: yup
      .string()
      .required('Выберите способ связи')
      .oneOf(['email', 'phone', 'telegram', 'whatsapp'], 'Некорректный способ связи'),
  },
  {
    name: 'message',
    type: 'textarea',
    label: 'Сообщение',
    required: true,
    attrs: {
      placeholder: 'Опишите ваш вопрос или предложение...',
      rows: 6,
    },
    validation: yup
      .string()
      .required('Введите сообщение')
      .min(10, 'Минимум 10 символов')
      .max(1000, 'Максимум 1000 символов'),
  },
  {
    name: 'agreeToPrivacy',
    type: 'checkbox',
    label: 'Я согласен на обработку персональных данных и с политикой конфиденциальности',
    required: true,
    validation: yup.boolean().oneOf([true], 'Необходимо согласие на обработку данных'),
  },
];

const onSubmit = (data: Record<string, any>) => {
  const cleanedData = {
    ...data,
    phone: data.phone ? data.phone.replace(/\D/g, '') : '',
  };

  store.dispatch('saveForm', {
    formName: 'contact',
    data: cleanedData,
  });

  alert('✅ Спасибо за обращение! Мы свяжемся с вами в ближайшее время.');

  onCancel();
};

const onCancel = () => {
  formRef.value?.reset();
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/shared-page-styles';
</style>
