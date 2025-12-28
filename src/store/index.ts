import { createStore } from 'vuex';

interface FormSubmission {
  formName: string;
  data: Record<string, any>;
  timestamp: number;
}

interface State {
  formHistory: FormSubmission[];
  theme: 'light' | 'dark';
}

const store = createStore<State>({
  state(): State {
    const savedHistory = localStorage.getItem('formHistory');
    return {
      formHistory: savedHistory ? JSON.parse(savedHistory) : [],
      theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    };
  },

  mutations: {
    ADD_FORM_SUBMISSION(state: State, submission: FormSubmission) {
      state.formHistory.unshift(submission);
      if (state.formHistory.length > 50) {
        state.formHistory = state.formHistory.slice(0, 50);
      }
      localStorage.setItem('formHistory', JSON.stringify(state.formHistory));
    },

    CLEAR_FORM_HISTORY(state: State) {
      state.formHistory = [];
      localStorage.removeItem('formHistory');
    },

    SET_THEME(state: State, theme: 'light' | 'dark') {
      state.theme = theme;
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    },
  },

  actions: {
    saveForm({ commit }, payload: { formName: string; data: Record<string, any> }) {
      const submission: FormSubmission = {
        formName: payload.formName,
        data: payload.data,
        timestamp: Date.now(),
      };
      commit('ADD_FORM_SUBMISSION', submission);
    },

    clearHistory({ commit }) {
      commit('CLEAR_FORM_HISTORY');
    },

    toggleTheme({ commit, state }) {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      commit('SET_THEME', newTheme);
    },

    initTheme({ commit, state }) {
      document.documentElement.setAttribute('data-theme', state.theme);
    },
  },

  getters: {
    getAllForms: (state: State) => state.formHistory,

    getFormsByName: (state: State) => (formName: string) => {
      return state.formHistory.filter(f => f.formName === formName);
    },

    getRecentForms:
      (state: State) =>
      (limit: number = 10) => {
        return state.formHistory.slice(0, limit);
      },

    currentTheme: (state: State) => state.theme,
  },
});

export default store;
