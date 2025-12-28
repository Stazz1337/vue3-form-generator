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

        <template #field-displayName="{ field }">
          <div class="profile-field">
            <label class="profile-label">
              👤 {{ field.label }}
              <span v-if="field.required" class="required">*</span>
            </label>
            <Field
              :name="field.name"
              type="text"
              class="form-control profile-input"
              v-bind="field.attrs" />
            <ErrorMessage :name="field.name" class="error-message" />
            <small class="field-hint">Это имя будет отображаться в вашем профиле</small>
          </div>
        </template>

        <template #input-bio="{ field }">
          <div class="bio-field-wrapper">
            <Field
              :name="field.name"
              as="textarea"
              class="form-control bio-textarea"
              v-bind="field.attrs" />
            <div class="char-counter">
              <Field :name="field.name" v-slot="{ value }">
                {{ (value || '').length }} / 200
              </Field>
            </div>
          </div>
        </template>

        <template #label-website="{ field }">
          <label :for="field.name" class="profile-label"> 🌐 {{ field.label }} </label>
        </template>

        <template #field-theme="{ field }">
          <div class="theme-field">
            <label class="profile-label">
              🎨 {{ field.label }}
              <span v-if="field.required" class="required">*</span>
            </label>
            <Field :name="field.name" as="select" class="form-control theme-select">
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </Field>
            <ErrorMessage :name="field.name" class="error-message" />
          </div>
        </template>

        <template #field-notifications="{ field }">
          <div class="checkbox-field">
            <label class="checkbox-label">
              <Field
                :name="field.name"
                type="checkbox"
                class="checkbox-input"
                :value="true"
                :unchecked-value="false" />
              <span class="checkbox-content">
                <span class="checkbox-icon">🔔</span>
                <span class="checkbox-text">{{ field.label }}</span>
              </span>
            </label>
          </div>
        </template>

        <template #field-publicProfile="{ field }">
          <div class="checkbox-field">
            <label class="checkbox-label">
              <Field
                :name="field.name"
                type="checkbox"
                class="checkbox-input"
                :value="true"
                :unchecked-value="false" />
              <span class="checkbox-content">
                <span class="checkbox-icon">🌍</span>
                <span class="checkbox-text">{{ field.label }}</span>
              </span>
            </label>
          </div>
        </template>

        <template #form-actions="{ meta, isSubmitting }">
          <div class="profile-actions">
            <button
              type="submit"
              class="btn btn--primary btn--save"
              :disabled="!meta.valid || isSubmitting">
              <span v-if="!isSubmitting">💾 Сохранить изменения</span>
              <span v-else>⏳ Сохранение...</span>
            </button>
            <button type="button" class="btn btn--secondary" @click="onCancel">↺ Сбросить</button>
          </div>
        </template>
      </FormGenerator>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import { Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import FormGenerator from '@/components/FormGenerator.vue';
import type { FormField } from '@/components/FormGenerator.vue';

const store = useStore();

const formRef = ref<InstanceType<typeof FormGenerator> | null>(null);

const formData = {
  displayName: '',
  bio: '',
  website: '',
  theme: 'auto',
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
.profile-field {
  margin-bottom: 1.5rem;
}

.profile-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}

.required {
  color: #dc3545;
  margin-left: 2px;
}

.profile-input {
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
}

.field-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #6c757d;
  font-style: italic;
}

.bio-field-wrapper {
  position: relative;

  .bio-textarea {
    padding-bottom: 2.5rem;
    resize: vertical;
  }

  .char-counter {
    position: absolute;
    bottom: 0.75rem;
    right: 0.75rem;
    font-size: 0.75rem;
    color: #6c757d;
    background: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
}

.theme-field {
  .theme-select {
    border: 2px solid #e0e0e0;
    font-size: 1rem;
    cursor: pointer;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
  }
}

.checkbox-field {
  margin-bottom: 1rem;

  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: #f8f9fa;
      border-color: #007bff;
    }

    .checkbox-input {
      margin: 0;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .checkbox-content {
      display: flex;
      align-items: center;
      margin-left: 0.75rem;
      flex: 1;

      .checkbox-icon {
        font-size: 1.25rem;
        margin-right: 0.5rem;
      }

      .checkbox-text {
        font-weight: 500;
      }
    }
  }
}

.profile-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  .btn--save {
    flex: 2;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
  }

  .btn--secondary {
    flex: 1;
  }
}
</style>
