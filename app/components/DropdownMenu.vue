<template>
  <div ref="rootRef" class="dropdown-root" @click.stop>
    <button
      class="dropdown-trigger"
      :class="{ 'is-open': isOpen }"
      type="button"
      @click="toggle"
    >
      <slot name="trigger">
        <Icon name="mdi:dots-vertical" />
      </slot>
    </button>

    <Teleport to="body">
      <Transition name="dropdown-fade">
        <div
          v-if="isOpen"
          class="dropdown-menu"
          :style="menuStyle"
          @click="close"
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const rootRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const menuStyle = ref<Record<string, string>>({});

function toggle() {
  if (!isOpen.value) {
    const rect = rootRef.value!.getBoundingClientRect();
    menuStyle.value = {
      position: "fixed",
      top: `${rect.bottom + 6}px`,
      right: `${window.innerWidth - rect.right}px`,
    };
  }
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
}

onMounted(() => document.addEventListener("click", close));
onUnmounted(() => document.removeEventListener("click", close));
</script>

<style scoped>
.dropdown-root {
  flex-shrink: 0;
}

.dropdown-trigger {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  border: 1.5px solid var(--border-soft);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    border-color 0.12s,
    background 0.12s,
    color 0.12s;

  &:hover,
  &.is-open {
    border-color: var(--green-main);
    background: var(--green-soft);
    color: var(--green-dark);
  }
}
</style>

<!-- Global: teleported dropdown lives outside component's DOM subtree -->
<style>
.dropdown-menu {
  z-index: 9999;
  background: #fff;
  border: 1px solid var(--border-soft);
  border-radius: 1.2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  min-width: 16rem;
  display: flex;
  flex-direction: column;
  padding: 0.4rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem 1.2rem;
  border-radius: 0.8rem;
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--text-main);
  text-decoration: none;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: var(--font-ui);
  text-align: left;
  width: 100%;
  transition: background 0.12s;
}

.dropdown-item:hover {
  background: var(--bg);
}

.dropdown-item--danger {
  color: #dc2626;
}

.dropdown-item--danger:hover {
  background: #fef2f2;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
