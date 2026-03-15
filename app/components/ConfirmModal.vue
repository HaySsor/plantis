<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="emit('cancel')">
        <div class="modal" role="dialog" aria-modal="true">
          <div class="modal-icon">
            <Icon name="mdi:alert-outline" />
          </div>
          <h2 class="modal-title">{{ title }}</h2>
          <p class="modal-message">{{ message }}</p>
          <div class="modal-actions">
            <button class="btn-cancel" :disabled="loading" @click="emit('cancel')">
              Anuluj
            </button>
            <button class="btn-confirm" :disabled="loading" @click="emit('confirm')">
              <Icon v-if="loading" name="mdi:loading" class="spin" />
              {{ confirmLabel ?? 'Potwierdź' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<style lang="scss" scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(20, 35, 25, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 2rem;
  padding: 3.2rem 2.8rem 2.4rem;
  max-width: 42rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
}

.modal-icon {
  width: 5.6rem;
  height: 5.6rem;
  border-radius: 50%;
  background: #fff1f2;
  border: 1.5px solid #fca5a5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.6rem;
  color: #dc2626;
  margin-bottom: 0.4rem;
}

.modal-title {
  font-family: var(--font-title);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.modal-message {
  font-size: 1.5rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.8rem;
  width: 100%;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 1.1rem 1.6rem;
  border-radius: 999px;
  font-size: 1.5rem;
  font-family: var(--font-ui);
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s,
    opacity 0.15s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-cancel {
  background: var(--surface);
  border: 1.5px solid var(--border-soft);
  color: var(--text-muted);

  &:hover:not(:disabled) {
    background: var(--green-soft);
    color: var(--green-dark);
    border-color: var(--green-main);
  }
}

.btn-confirm {
  background: #dc2626;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;

  &:hover:not(:disabled) {
    background: #b91c1c;
  }
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;

  .modal {
    transition: transform 0.2s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal {
    transform: scale(0.95) translateY(8px);
  }
}
</style>
