<template>
  <div class="registration-page page-container">
    <div class="form-section">
      <FormGenerator
        ref="formRef"
        :fields="fields"
        :initial-values="formData"
        @submit="onSubmit"
        @cancel="onCancel"
        submit-button-text="Зарегистрироваться"
        cancel-button-text="Очистить форму">
      </FormGenerator>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import * as yup from 'yup';
import FormGenerator from '@/components/FormGenerator.vue';
import type { FormField } from '@/components/FormGenerator.vue';

const store = useStore();
const formRef = ref<InstanceType<typeof FormGenerator> | null>(null);

const formData = {
  username: '',
  email: '',
  password: '',
  age: '',
  country: '',
  acceptTerms: false,
  newsletter: false,
};

const fields: FormField[] = [
  {
    name: 'username',
    type: 'text',
    label: 'Имя пользователя',
    required: true,
    attrs: {
      placeholder: 'Введите имя пользователя',
    },
    validation: yup.string().required('Имя пользователя обязательно').min(3, 'Минимум 3 символа'),
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    required: true,
    attrs: {
      placeholder: 'example@example.com',
    },
    validation: yup.string().email('Некорректный email').required('Email обязателен'),
  },
  {
    name: 'password',
    type: 'text',
    label: 'Пароль',
    required: true,
    attrs: {
      type: 'password',
      placeholder: 'Введите пароль',
    },
    validation: yup.string().required('Пароль обязателен').min(6, 'Минимум 6 символов'),
  },
  {
    name: 'age',
    type: 'text',
    label: 'Возраст',
    required: true,
    attrs: {
      type: 'number',
      min: 18,
      max: 120,
      placeholder: '18',
    },
    validation: yup
      .number()
      .nullable()
      .typeError('Возраст должен быть числом')
      .required('Возраст обязателен')
      .min(18, 'Минимальный возраст 18 лет')
      .max(120, 'Максимальный возраст 120 лет'),
  },
  {
    name: 'country',
    type: 'select',
    label: 'Страна',
    required: true,
    options: [
      { value: '', label: 'Выберите страну' },
      { value: 'ru', label: '🇷🇺 Россия' },
      { value: 'us', label: '🇺🇸 США' },
      { value: 'de', label: '🇩🇪 Германия' },
      { value: 'fr', label: '🇫🇷 Франция' },
      { value: 'uk', label: '🇬🇧 Великобритания' },
      { value: 'it', label: '🇮🇹 Италия' },
      { value: 'es', label: '🇪🇸 Испания' },
    ],
    validation: yup.string().required('Страна обязательна'),
  },
  {
    name: 'acceptTerms',
    type: 'checkbox',
    label: 'Я согласен с условиями использования',
    required: true,
    validation: yup.boolean().oneOf([true], 'Необходимо согласие с условиями использования'),
  },
  {
    name: 'newsletter',
    type: 'checkbox',
    label: 'Подписаться на рассылку новостей',
    required: false,
  },
];

const onSubmit = (data: Record<string, any>) => {
  store.dispatch('saveForm', {
    formName: 'registration',
    data: data,
  });

  alert('✅ Регистрация успешно завершена!\n\nДанные сохранены в историю.');

  onCancel();
};

const onCancel = () => {
  formRef.value?.reset();
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/shared-page-styles';
</style>
