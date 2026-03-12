<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
          @click="remove(toast.id)"
        >
          <Icon :name="iconFor(toast.type)" class="toast-icon" />
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" @click.stop="remove(toast.id)">
            <Icon name="mdi:close" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ToastType } from "~/composables/useToast";

const { toasts, remove } = useToast();

function iconFor(type: ToastType) {
  const map: Record<ToastType, string> = {
    info:    "mdi:information-outline",
    success: "mdi:check-circle-outline",
    error:   "mdi:alert-circle-outline",
    warning: "mdi:alert-outline",
  };
  return map[type];
}
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  z-index: 9999;
  pointer-events: none;
  width: min(46rem, calc(100vw - 3.2rem));
}

.toast {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.6rem;
  border-radius: 1.4rem;
  font-size: 1.4rem;
  font-weight: 500;
  width: 100%;
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

  &--info {
    background: #fff;
    border: 1.5px solid var(--border-soft);
    color: var(--text-main);

    .toast-icon { color: var(--green-main); }
  }

  &--success {
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    color: #166534;

    .toast-icon { color: #16a34a; }
  }

  &--error {
    background: #fef2f2;
    border: 1.5px solid #fca5a5;
    color: #991b1b;

    .toast-icon { color: #ef4444; }
  }

  &--warning {
    background: #fffbeb;
    border: 1.5px solid #fcd34d;
    color: #92400e;

    .toast-icon { color: #d97706; }
  }
}

.toast-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.toast-msg {
  flex: 1;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.6rem;
  color: inherit;
  opacity: 0.5;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  padding: 0.2rem;
  transition: opacity 0.15s;

  &:hover { opacity: 1; }
}

/* ── Transitions ── */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-1.6rem) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-0.8rem) scale(0.96);
}
</style>
