import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import RegistrationPage from '@/views/RegistrationPage.vue';
import FeedbackPage from '@/views/FeedbackPage.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import ContactPage from '@/views/ContactPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: 'Главная',
      description: 'Генератор форм на Vue 3',
    },
  },
  {
    path: '/registration',
    name: 'Registration',
    component: RegistrationPage,
    meta: {
      title: 'Регистрация',
      description: 'Форма регистрации нового пользователя',
    },
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: FeedbackPage,
    meta: {
      title: 'Обратная связь',
      description: 'Форма для отправки обратной связи',
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: {
      title: 'Настройки профиля',
      description: 'Управление настройками профиля',
    },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactPage,
    meta: {
      title: 'Контакты',
      description: 'Свяжитесь с нами',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | FormGenerator` : 'FormGenerator';
  next();
});

export default router;
