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
        <template #field-username="{ field }">
          <div class="reg-field">
            <label class="reg-label">
              👤 {{ field.label }}
              <span v-if="field.required" class="required">*</span>
            </label>
            <Field
              :name="field.name"
              type="text"
              class="form-control reg-input"
              v-bind="field.attrs" />
            <ErrorMessage :name="field.name" class="error-message" />
            <small class="field-hint">Минимум 3 символа, будет использоваться для входа</small>
          </div>
        </template>

        <template #label-email="{ field }">
          <label :for="field.name" class="reg-label">
            📧 {{ field.label }}
            <span v-if="field.required" class="required">*</span>
          </label>
        </template>

        <template #field-password="{ field }">
          <div class="password-field">
            <label class="reg-label">
              🔒 {{ field.label }}
              <span v-if="field.required" class="required">*</span>
            </label>
            <Field
              :name="field.name"
              type="password"
              class="form-control password-input"
              v-bind="field.attrs" />
            <ErrorMessage :name="field.name" class="error-message" />
            <div class="password-strength">
              <small>Минимум 6 символов</small>
            </div>
          </div>
        </template>

        <template #label-age="{ field }">
          <label :for="field.name" class="reg-label">
            🎂 {{ field.label }}
            <span v-if="field.required" class="required">*</span>
          </label>
        </template>

        <template #field-country="{ field }">
          <div class="country-field">
            <label class="reg-label">
              🌍 {{ field.label }}
              <span v-if="field.required" class="required">*</span>
            </label>
            <Field :name="field.name" as="select" class="form-control country-select">
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </Field>
            <ErrorMessage :name="field.name" class="error-message" />
          </div>
        </template>

        <template #field-acceptTerms="{ field }">
          <div class="terms-field">
            <label class="terms-label">
              <Field
                :name="field.name"
                type="checkbox"
                class="terms-checkbox"
                :value="true"
                :unchecked-value="false" />
              <span class="terms-text">
                <strong>{{ field.label }}</strong>
                <br />
                <small
                  >Регистрируясь, вы соглашаетесь с нашими
                  <a href="/terms" target="_blank">условиями использования</a> и
                  <a href="/privacy" target="_blank">политикой конфиденциальности</a>
                </small>
              </span>
            </label>
            <ErrorMessage :name="field.name" class="error-message" />
          </div>
        </template>

        <template #field-newsletter="{ field }">
          <div class="newsletter-field">
            <label class="newsletter-label">
              <Field
                :name="field.name"
                type="checkbox"
                class="newsletter-checkbox"
                :value="true"
                :unchecked-value="false" />
              <span class="newsletter-content">
                <span class="newsletter-icon">📬</span>
                <span class="newsletter-text">{{ field.label }}</span>
              </span>
            </label>
          </div>
        </template>

        <template #form-actions="{ meta, isSubmitting }">
          <div class="reg-actions">
            <button
              type="submit"
              class="btn btn--primary btn--register"
              :disabled="!meta.valid || isSubmitting">
              <span v-if="!isSubmitting">🚀 Зарегистрироваться</span>
              <span v-else>⏳ Регистрация...</span>
            </button>
            <button type="button" class="btn btn--secondary" @click="onCancel">
              🔄 Очистить форму
            </button>
            <div class="login-link">Уже есть аккаунт? <a href="/login">Войти</a></div>
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
.reg-field {
  margin-bottom: 1.5rem;
}

.reg-label {
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

.reg-input {
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
}

.password-field {
  .password-input {
    border: 2px solid #e0e0e0;
    font-family: 'Courier New', monospace;

    &:focus {
      border-color: #28a745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }
  }

  .password-strength {
    margin-top: 0.5rem;

    small {
      color: #6c757d;
      font-size: 0.8rem;
    }
  }
}

.country-field {
  .country-select {
    border: 2px solid #e0e0e0;
    font-size: 1rem;
    cursor: pointer;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
  }
}

.terms-field {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;

  .terms-label {
    display: flex;
    align-items: flex-start;
    cursor: pointer;

    .terms-checkbox {
      margin-right: 0.75rem;
      margin-top: 0.25rem;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .terms-text {
      flex: 1;
      line-height: 1.6;

      strong {
        font-weight: 600;
        color: #856404;
      }

      small {
        color: #856404;

        a {
          color: #0056b3;
          text-decoration: underline;
          font-weight: 500;

          &:hover {
            color: #003d82;
          }
        }
      }
    }
  }
}

.newsletter-field {
  margin-bottom: 1.5rem;

  .newsletter-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: #f0f8ff;
      border-color: #17a2b8;
    }

    .newsletter-checkbox {
      margin: 0;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .newsletter-content {
      display: flex;
      align-items: center;
      margin-left: 0.75rem;
      flex: 1;

      .newsletter-icon {
        font-size: 1.5rem;
        margin-right: 0.75rem;
      }

      .newsletter-text {
        font-weight: 500;
      }
    }
  }
}

.reg-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;

  .btn--register {
    padding: 0.875rem 1.5rem;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .login-link {
    text-align: center;
    padding: 0.5rem;
    color: #6c757d;

    a {
      color: #007bff;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
