<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">
        <span class="brand-icon">📝</span>
        <span class="brand-text">FormGenerator</span>
      </router-link>

      <button class="navbar-toggle" @click="toggleMobileMenu" :class="{ active: mobileMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul class="navbar-menu" :class="{ open: mobileMenuOpen }">
        <li>
          <router-link to="/" @click="closeMobileMenu">
            <span class="menu-icon">🏠</span>
            Главная
          </router-link>
        </li>
        <li>
          <router-link to="/registration" @click="closeMobileMenu">
            <span class="menu-icon">👤</span>
            Регистрация
          </router-link>
        </li>
        <li>
          <router-link to="/feedback" @click="closeMobileMenu">
            <span class="menu-icon">💬</span>
            Отзыв
          </router-link>
        </li>
        <li>
          <router-link to="/profile" @click="closeMobileMenu">
            <span class="menu-icon">⚙️</span>
            Профиль
          </router-link>
        </li>
        <li>
          <router-link to="/contact" @click="closeMobileMenu">
            <span class="menu-icon">📧</span>
            Контакты
          </router-link>
        </li>
      </ul>

      <button class="theme-toggle" @click="toggleTheme" :title="themeTitle">
        <span v-if="currentTheme === 'light'">🌙</span>
        <span v-else>☀️</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const mobileMenuOpen = ref(false);

const currentTheme = computed(() => store.getters.currentTheme);

const themeTitle = computed(() =>
  currentTheme.value === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему',
);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const toggleTheme = () => {
  store.dispatch('toggleTheme');
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.navbar {
  background: var(--bg-secondary);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--primary-color);
  font-weight: 700;
  font-size: 1.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
}

.brand-icon {
  font-size: 2rem;
}

.navbar-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  position: relative;

  span {
    width: 25px;
    height: 3px;
    background: var(--text-primary);
    border-radius: 3px;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  &.active {
    span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    span:nth-child(2) {
      opacity: 0;
      transform: scale(0);
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
  }
}

.navbar-menu {
  display: flex;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    a {
      display: flex;
      align-items: center;

      padding: 0.75rem 1.25rem;
      text-decoration: none;
      color: var(--text-primary);
      border-radius: 8px;
      transition: all 0.2s;
      font-weight: 500;

      &:hover {
        background: var(--hover-bg);
        color: var(--primary-color);
      }

      &.router-link-active {
        background: var(--primary-color);
        color: white;
      }
    }
  }
}

.menu-icon {
  font-size: 1.2rem;
}

.theme-toggle {
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: rotate(20deg) scale(1.1);
    border-color: var(--primary-color);
  }
}

@media (max-width: 1024px) {
  .navbar-container {
    padding: 0 1rem;
  }

  .navbar-toggle {
    display: flex;
  }

  .navbar-menu {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: var(--bg-secondary);
    flex-direction: column;
    gap: 0;
    padding: 1rem;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;

    &.open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    li a {
      padding: 1rem;
    }
  }
}
</style>
