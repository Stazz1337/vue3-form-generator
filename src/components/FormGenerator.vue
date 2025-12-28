<template>
  <Form
    ref="formRef"
    class="form-generator"
    :validation-schema="validationSchema"
    :initial-values="initialValues"
    @submit="onSubmit"
    v-slot="{ meta, isSubmitting }">
    <div
      v-for="field in fields"
      :key="field.name"
      :class="['form-group', { 'form-group--inline': field.inline }]">
      <label v-if="field.label && field.type !== 'checkbox'" :for="field.name" class="form-label">
        {{ field.label }}
        <span v-if="field.required" class="required">*</span>
      </label>

      <template v-if="field.type === 'checkbox'">
        <label class="form-checkbox-label">
          <Field
            :name="field.name"
            type="checkbox"
            class="form-control form-checkbox"
            :value="true"
            :unchecked-value="false"
            v-bind="field.attrs" />
          <span>{{ field.label }}</span>
        </label>
      </template>

      <template v-else>
        <Field
          :name="field.name"
          :as="getFieldComponent(field.type)"
          :type="field.type !== 'textarea' && field.type !== 'select' ? field.type : undefined"
          v-bind="field.attrs"
          @input="handleFieldInput($event, field)"
          class="form-control">
          <option v-for="option in field.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </Field>
      </template>

      <ErrorMessage :name="field.name" class="error-message" />
    </div>

    <slot name="form-actions" :meta="meta">
      <div class="form-actions">
        <button type="submit" class="btn btn--primary" :disabled="submitDisabled || isSubmitting">
          {{ submitButtonText }}
        </button>

        <button type="button" class="btn btn--secondary" @click="handleCancel">
          {{ cancelButtonText }}
        </button>
      </div>
    </slot>
  </Form>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch } from 'vue';
import { Form, Field, ErrorMessage, type FormContext } from 'vee-validate';
import * as yup from 'yup';
import { usePhoneMask } from '@/composables/usePhoneMask';

type FieldType = 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'textarea';

export interface FormField {
  name: string;
  type: FieldType;
  label?: string;
  required?: boolean;
  attrs?: Record<string, any>;
  options?: { value: any; label: string }[];
  inline?: boolean;
  validation?: yup.AnySchema;
  mask?: 'phone';
}

interface Props {
  fields: FormField[];
  initialValues?: Record<string, any>;
  submitDisabled?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  submitDisabled: false,
  submitButtonText: 'Сохранить',
  cancelButtonText: 'Отмена',
});

const emit = defineEmits<{
  submit: [value: Record<string, any>];
  cancel: [];
}>();

const formRef = ref<FormContext | null>(null);

const { handleInput: handlePhoneInput } = usePhoneMask();

const checkboxValues = reactive<Record<string, boolean>>({});

props.fields.forEach(f => {
  if (f.type === 'checkbox') {
    checkboxValues[f.name] = props.initialValues?.[f.name] ?? false;
  }
});

watch(
  checkboxValues,
  newVals => {
    Object.entries(newVals).forEach(([name, value]) => {
      formRef.value?.setFieldValue(name, value);
    });
  },
  { deep: true },
);

const initialValues = props.initialValues || {};

const validationSchema = computed(() => {
  const shape: Record<string, yup.AnySchema> = {};

  props.fields.forEach(field => {
    let schema: yup.AnySchema;

    if (field.validation) {
      schema = field.validation;
    } else {
      switch (field.type) {
        case 'checkbox':
          schema = yup.boolean().oneOf([true], 'Необходимо согласие');
          break;
        case 'number':
          schema = yup.number().nullable();
          if (field.required) schema = schema.required('Обязательное поле');
          break;
        default:
          schema = yup.string();
          if (field.required) schema = schema.required('Обязательное поле');
      }
    }

    shape[field.name] = schema;
  });

  return yup.object(shape);
});

const handleFieldInput = (event: Event, field: FormField) => {
  if (field.mask === 'phone') {
    handlePhoneInput(event);
  }
};

const onSubmit = (values: Record<string, any>) => {
  emit('submit', values);
};

const reset = () => {
  formRef.value?.resetForm();
  Object.keys(checkboxValues).forEach(k => (checkboxValues[k] = initialValues[k] ?? false));
};

const handleCancel = () => {
  reset();
  emit('cancel');
};

defineExpose({ reset });

const getFieldComponent = (type: FieldType) => {
  switch (type) {
    case 'textarea':
      return 'textarea';
    case 'select':
      return 'select';
    default:
      return 'input';
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.form-generator {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 1rem;

  &--inline {
    display: flex;
    align-items: center;

    .form-control {
      margin-right: 10px;
    }
  }
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.required {
  color: #dc3545;
  margin-left: 2px;
}

.form-checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  line-height: 1.5;
  margin-bottom: 0.5rem;

  .form-checkbox {
    margin-right: 0.5rem;
    margin-top: 0.25rem;
    width: auto;
  }

  span {
    user-select: none;
    flex: 1;
  }
}

.form-checkbox {
  width: auto;
  margin-top: 0;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  &--error {
    border-color: #dc3545;
  }
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;

  &--primary {
    background-color: #007bff;
    color: white;

    &:hover:not(:disabled) {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &--secondary {
    background-color: #6c757d;
    color: white;

    &:hover {
      background-color: #545b62;
    }
  }
}
</style>
