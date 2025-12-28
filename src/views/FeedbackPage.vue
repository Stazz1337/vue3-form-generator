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
import { phoneValidation } from '@/utils/phoneValidation';
import FormGenerator from '@/components/FormGenerator.vue';
import type { FormField } from '@/components/FormGenerator.vue';

const store = useStore();

const formRef = ref<InstanceType<typeof FormGenerator> | null>(null);

const formData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
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
    validation: yup.string().required('Введите ваше имя').min(2, 'Минимум 2 символа'),
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
    mask: 'phone',
    attrs: {
      placeholder: '+7 (999) 123-45-67',
      maxlength: 18,
    },
    validation: phoneValidation,
  },
  {
    name: 'subject',
    type: 'text',
    label: 'Тема обращения',
    required: true,
    attrs: { placeholder: 'О чем вы хотите спросить?' },
    validation: yup.string().required('Укажите тему обращения'),
  },
  {
    name: 'message',
    type: 'textarea',
    label: 'Сообщение',
    required: true,
    attrs: { placeholder: 'Подробно опишите ваш вопрос...', rows: 6 },
    validation: yup.string().required('Введите сообщение').max(500, 'Максимум 500 символов'),
  },
  {
    name: 'agreeToPrivacy',
    type: 'checkbox',
    label: 'Я согласен с политикой конфиденциальности',
    required: true,
    validation: yup.boolean().oneOf([true], 'Необходимо согласие'),
  },
];

const onSubmit = (data: Record<string, any>) => {
  const cleanedData = {
    ...data,
    phone: data.phone ? data.phone.replace(/\D/g, '') : '',
  };

  store.dispatch('saveForm', {
    formName: 'feedback',
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
