<template>
  <div class="profile-page page-container">
    <div class="form-section">
      <FormGenerator
        ref="formRef"
        :fields="fields"
        :initial-values="formData"
        @submit="onSubmit"
        @cancel="onCancel"
        submit-button-text="Сохранить изменения"
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
  displayName: '',
  bio: '',
  website: '',
  theme: '',
  notifications: true,
  publicProfile: true,
};

const fields: FormField[] = [
  {
    name: 'displayName',
    type: 'text',
    label: 'Отображаемое имя',
    required: true,
    attrs: { placeholder: 'Как вас называть?' },
    validation: yup.string().required('Отображаемое имя обязательно'),
  },
  {
    name: 'bio',
    type: 'textarea',
    label: 'О себе',
    required: false,
    attrs: { placeholder: 'Расскажите о себе...', rows: 4 },
    validation: yup.string().max(200, 'Максимум 200 символов'),
  },
  {
    name: 'website',
    type: 'text',
    label: 'Веб-сайт',
    required: false,
    attrs: { type: 'url', placeholder: 'https://...' },
    validation: yup.string().url('Некорректный URL').nullable(),
  },
  {
    name: 'theme',
    type: 'select',
    label: 'Тема оформления',
    required: true,
    options: [
      { value: 'light', label: '☀️ Светлая' },
      { value: 'dark', label: '🌙 Темная' },
      { value: 'auto', label: '⚙️ Автоматическая' },
    ],
    validation: yup.string().required('Выберите тему оформления'),
  },
  {
    name: 'notifications',
    type: 'checkbox',
    label: 'Получать уведомления о новых событиях',
    required: false,
  },
  {
    name: 'publicProfile',
    type: 'checkbox',
    label: 'Сделать профиль публичным',
    required: false,
  },
];

const onSubmit = (data: Record<string, any>) => {
  store.dispatch('saveForm', { formName: 'profile', data });
  alert('✅ Настройки профиля успешно сохранены!');
  onCancel();
};

const onCancel = () => {
  formRef.value?.reset();
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/shared-page-styles';
</style>
