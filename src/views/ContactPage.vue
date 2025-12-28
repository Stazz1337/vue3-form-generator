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
          <div class="custom-email-field">
            <label class="form-label">
              📧 {{ field.label }}
              <span v-if="field.required" class="required">*</span>
            </label>
            <Field
              :name="field.name"
              type="email"
              class="form-control custom-input"
              v-bind="field.attrs" />
            <ErrorMessage :name="field.name" class="error-message" />
            <small class="hint">Мы никогда не передадим ваш email третьим лицам</small>
          </div>
        </template>

        <template #error-phone="{ field }">
          <ErrorMessage :name="field.name" v-slot="{ message }">
            <div class="custom-error">⚠️ {{ message }}</div>
          </ErrorMessage>
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
                {{ (value || '').length }} / 1000
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
                Я согласен на обработку
                <a href="/privacy" target="_blank">персональных данных</a>
                и с <a href="/policy" target="_blank">политикой конфиденциальности</a>
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
            <button type="button" class="btn btn--text" @click="onCancel">Очистить форму</button>
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

.custom-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.required {
  color: #dc3545;
  margin-left: 2px;
}

.custom-email-field {
  .custom-input {
    border: 2px solid #007bff;
    &:focus {
      border-color: #0056b3;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
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

.custom-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  padding: 0.5rem;
  background-color: #ffe6e6;
  border-left: 3px solid #dc3545;
  border-radius: 4px;
}

.message-field-wrapper {
  position: relative;

  .message-textarea {
    padding-bottom: 2rem;
  }

  .char-counter {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    font-size: 0.75rem;
    color: #6c757d;
  }
}

.custom-privacy-field {
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

        &:hover {
          color: #0056b3;
        }
      }
    }
  }
}

.custom-form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;

  .btn--large {
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .btn--text {
    background: none;
    color: #6c757d;
    text-decoration: underline;
    padding: 0.5rem;

    &:hover {
      color: #495057;
      background: none;
    }
  }
}
</style>
