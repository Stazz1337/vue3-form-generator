<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">FormGenerator</span>
        </h1>
        <p class="hero-subtitle">Переиспользуемый компонент для генерации форм на Vue 3</p>
        <p class="hero-description">
          Создавайте сложные формы с валидацией, кастомизацией и минимальным количеством кода.
          Поддержка TypeScript, Composition API и полная типизация.
        </p>
        <div class="hero-actions">
          <router-link to="/registration" class="btn btn-primary btn-large">
            Попробовать демо
          </router-link>
          <button @click="scrollToFeatures" class="btn btn-secondary btn-large">
            Узнать больше
          </button>
        </div>
      </div>

      <div class="hero-illustration">
        <div class="code-preview">
          <div class="code-header">
            <span class="code-dot"></span>
            <span class="code-dot"></span>
            <span class="code-dot"></span>
          </div>
          <pre class="code-content"><code>&lt;FormGenerator
  :fields="fields"
  v-model="formData"
  @submit="onSubmit"
  @cancel="onCancel"
/&gt;</code></pre>
        </div>
      </div>
    </section>

    <section ref="featuresSection" class="features">
      <h2 class="section-title">Возможности</h2>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Быстрая настройка</h3>
          <p>Определите структуру формы в массиве объектов и получите готовую форму с валидацией</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>Кастомизация через слоты</h3>
          <p>Полный контроль над внешним видом каждого поля формы через Vue slots</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">✅</div>
          <h3>Валидация из коробки</h3>
          <p>Интеграция с vee-validate и yup для мощной валидации форм</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>Адаптивный дизайн</h3>
          <p>Работает на всех устройствах: десктоп, планшет, мобильный</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>TypeScript</h3>
          <p>Полная типизация для безопасной разработки</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>Composition API</h3>
          <p>Современный подход с использованием Vue 3 Composition API</p>
        </div>
      </div>
    </section>

    <section class="demo-section">
      <h2 class="section-title">Примеры форм</h2>

      <div class="demo-cards">
        <router-link to="/registration" class="demo-card">
          <div class="demo-icon">👤</div>
          <h3>Регистрация</h3>
          <p>Форма регистрации с валидацией email, пароля и выбором страны</p>
          <span class="demo-link">Открыть пример →</span>
        </router-link>

        <router-link to="/feedback" class="demo-card">
          <div class="demo-icon">💬</div>
          <h3>Обратная связь</h3>
          <p>Форма с текстовым полем, рейтингом и выбором темы обращения</p>
          <span class="demo-link">Открыть пример →</span>
        </router-link>

        <router-link to="/profile" class="demo-card">
          <div class="demo-icon">⚙️</div>
          <h3>Настройки профиля</h3>
          <p>Форма с переключателями и настройками отображения</p>
          <span class="demo-link">Открыть пример →</span>
        </router-link>

        <router-link to="/contact" class="demo-card">
          <div class="demo-icon">📧</div>
          <h3>Контакты</h3>
          <p>Простая контактная форма с полями имени, email и сообщения</p>
          <span class="demo-link">Открыть пример →</span>
        </router-link>
      </div>
    </section>

    <section class="tech-stack">
      <h2 class="section-title">Технологический стек</h2>

      <div class="tech-list">
        <div class="tech-item">
          <span class="tech-badge">Vue 3</span>
        </div>
        <div class="tech-item">
          <span class="tech-badge">TypeScript</span>
        </div>
        <div class="tech-item">
          <span class="tech-badge">Vuex 4</span>
        </div>
        <div class="tech-item">
          <span class="tech-badge">Vue Router 4</span>
        </div>
        <div class="tech-item">
          <span class="tech-badge">Vee-Validate</span>
        </div>
        <div class="tech-item">
          <span class="tech-badge">Yup</span>
        </div>
        <div class="tech-item">
          <span class="tech-badge">SCSS</span>
        </div>
        <div class="tech-item">
          <span class="tech-badge">Composition API</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const featuresSection = ref<HTMLElement | null>(null);

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.home-page {
  animation: fadeIn 0.5s ease;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 4rem 0;
  min-height: 500px;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
}

.hero-content {
  animation: fadeIn 0.6s ease;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.1;

  @media (max-width: $breakpoint-md) {
    font-size: 2.5rem;
  }
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;

  @media (max-width: $breakpoint-md) {
    font-size: 1.2rem;
  }
}

.hero-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 1rem;

  @media (max-width: $breakpoint-lg) {
    justify-content: center;
  }

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
  }
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.hero-illustration {
  animation: fadeIn 0.8s ease 0.2s both;

  @media (max-width: $breakpoint-lg) {
    display: flex;
    justify-content: center;
  }
}

.code-preview {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
}

.code-header {
  background: var(--bg-tertiary);
  padding: 0.75rem 1rem;
  display: flex;
  gap: 0.5rem;
}

.code-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--border-color);
}

.code-content {
  padding: 2rem;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--text-primary);
  background: var(--bg-secondary);

  code {
    color: var(--primary-color);
  }
}

.features {
  padding: 5rem 0;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  margin: 3rem 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--text-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  transition: transform $transition-base;

  &:hover {
    transform: translateY(-5px);
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.demo-section {
  padding: 5rem 0;
}

.demo-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.demo-card {
  @include card;
  text-align: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.2);

    .demo-link {
      color: var(--primary-color);
    }
  }
}

.demo-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.demo-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.demo-card p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex-grow: 1;
}

.demo-link {
  color: var(--primary-color);
  font-weight: $font-weight-medium;
  transition: all $transition-base;
  margin-top: auto;
}

.tech-stack {
  padding: 5rem 0;
  text-align: center;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
}

.tech-item {
  animation: fadeIn 0.5s ease both;

  @for $i from 1 through 8 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.1}s;
    }
  }
}

.tech-badge {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 50px;
  font-weight: $font-weight-medium;
  color: var(--text-primary);
  transition: all $transition-base;

  &:hover {
    border-color: var(--primary-color);
    transform: scale(1.05);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
