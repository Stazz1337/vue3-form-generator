<template>
  <footer class="footer">
    <div class="footer-container">
      <p>&copy; 2026 FormGenerator. Vue 3 + TypeScript</p>
      <div class="footer-links">
        <button @click="showHistory" class="footer-link">
          История отправок ({{ historyCount }})
        </button>
        <button @click="clearHistory" class="footer-link">Очистить историю</button>
      </div>
    </div>
  </footer>

  <div v-if="historyModalOpen" class="modal-overlay" @click="closeHistory">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2>История отправок форм</h2>
        <button @click="closeHistory" class="modal-close">✕</button>
      </div>
      <div class="modal-body">
        <div v-if="formHistory.length === 0" class="empty-state">
          <p>История пуста</p>
        </div>
        <div v-else class="history-list">
          <div v-for="(item, index) in formHistory" :key="index" class="history-item">
            <div class="history-header">
              <strong>{{ item.formName }}</strong>
              <span class="history-time">{{ formatTime(item.timestamp) }}</span>
            </div>
            <pre class="history-data">{{ JSON.stringify(item.data, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const historyModalOpen = ref(false);

const formHistory = computed(() => store.getters.getRecentForms(20));
const historyCount = computed(() => store.getters.getAllForms.length);

const showHistory = () => {
  historyModalOpen.value = true;
};

const closeHistory = () => {
  historyModalOpen.value = false;
};

const clearHistory = () => {
  if (confirm('Вы уверены, что хотите очистить всю историю отправок?')) {
    store.dispatch('clearHistory');
    historyModalOpen.value = false;
  }
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString('ru-RU');
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  p {
    margin: 0;
    color: var(--text-secondary);
  }
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-link {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;

  &:hover {
    color: var(--primary-dark);
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  padding: 1rem;
}

.modal {
  background: var(--bg-secondary);
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.2s;

  &:hover {
    color: var(--text-primary);
  }
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;

  strong {
    color: var(--primary-color);
  }
}

.history-time {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.history-data {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  overflow-x: auto;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
  }
}
</style>
