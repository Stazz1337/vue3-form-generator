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
        @cancel="onCancel">
        <template #label-name="{ field }">
          <label :for="field.name" class="custom-label">
            👤 {{ field.label }}
            <span v-if="field.required" class="required">*</span>
          </label>
        </template>

        <template #field-email="{ field }">
          <div class="custom-field">
            <label class="custom-label">
              📧 {{ field.label }}
              <span v-if="field.required" class="required">*</span>
            </label>
            <Field
              :name="field.name"
              type="email"
              class="form-control custom-input"
              v-bind="field.attrs" />
            <ErrorMessage :name="field.name" class="error-message" />
            <small class="hint">Мы ответим вам на указанный email</small>
          </div>
        </template>

        <template #label-phone="{ field }">
          <label :for="field.name" class="custom-label"> 📱 {{ field.label }} </label>
        </template>

        <template #label-subject="{ field }">
          <label :for="field.name" class="custom-label">
            📝 {{ field.label }}
            <span v-if="field.required" class="required">*</span>
          </label>
        </template>

        <template #input-message="{ field }">
          <div class="message-field-wrapper">
            <Field
              :name="field.name"
              as="textarea"
              class="form-control message-textarea"
              v-bind="field.attrs" />
            <div class="char-counter">
              <Field :name="field.name" v-slot="{ value }">
                {{ (value || '').length }} / 500
              </Field>
            </div>
          </div>
        </template>

        <template #field-agreeToPrivacy="{ field }">
          <div class="custom-privacy-field">
            <label class="custom-checkbox-label">
              <Field
                :name="field.name"
                type="checkbox"
                class="custom-checkbox"
                :value="true"
                :unchecked-value="false" />
              <span class="checkbox-text">
                🔒 Я согласен с
                <a href="/privacy" target="_blank">политикой конфиденциальности</a>
              </span>
            </label>
            <ErrorMessage :name="field.name" class="error-message" />
          </div>
        </template>

        <template #form-actions="{ meta, isSubmitting }">
          <div class="custom-form-actions">
            <button
              type="submit"
              class="btn btn--primary btn--large"
              :disabled="!meta.valid || isSubmitting">
              <span v-if="!isSubmitting">✉️ Отправить сообщение</span>
              <span v-else>⏳ Отправка...</span>
            </button>
            <button type="button" class="btn btn--secondary" @click="onCancel">
              🔄 Очистить форму
            </button>
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

.custom-label {
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

.custom-field {
  .custom-input {
    border: 2px solid #e0e0e0;
    transition: all 0.3s ease;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
  }

  .hint {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: #6c757d;
    font-style: italic;
  }
}

.message-field-wrapper {
  position: relative;

  .message-textarea {
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

.custom-privacy-field {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;

  .custom-checkbox-label {
    display: flex;
    align-items: flex-start;
    cursor: pointer;

    .custom-checkbox {
      margin-right: 0.75rem;
      margin-top: 0.25rem;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .checkbox-text {
      flex: 1;
      line-height: 1.6;

      a {
        color: #007bff;
        text-decoration: underline;
        font-weight: 500;

        &:hover {
          color: #0056b3;
        }
      }
    }
  }
}

.custom-form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  .btn {
    flex: 1;

    &--large {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
    }
  }
}
</style>
