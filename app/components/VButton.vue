<template>
  <NuxtLink
    v-if="!props.isButton && props.href"
    :to="props.href"
    :class="buttonClasses"
    :aria-disabled="isDisabled"
    @click="handleLinkClick"
  >
    <span class="button-content" :class="{ 'is-hidden': props.loading }">
      <slot></slot>
    </span>
    <span v-if="props.loading" class="button-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </span>
  </NuxtLink>

  <button
    v-else
    :type="props.buttonType || 'button'"
    :class="buttonClasses"
    :disabled="isDisabled"
  >
    <span class="button-content" :class="{ 'is-hidden': props.loading }">
      <slot></slot>
    </span>
    <span v-if="props.loading" class="button-loader" aria-hidden="true">
      <span></span><span></span><span></span>
    </span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  isButton: boolean;
  type: "primary" | "secondary" | "dark" | "light" | "yellow";
  href?: string;
  customClass?: string;
  loading?: boolean;
  disabled?: boolean;
  buttonType?: "button" | "submit" | "reset";
}>();

const isDisabled = computed(() => Boolean(props.loading || props.disabled));
const buttonClasses = computed(() => [
  "v-button",
  props.type,
  props.customClass,
  { "is-loading": props.loading, "is-disabled": isDisabled.value },
]);

function handleLinkClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault();
    event.stopPropagation();
  }
}
</script>

<style lang="scss" scoped>
.v-button {
  display: flex;
  padding: 15px 20px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  font-size: 14px;
  font-family: var(--font-ui);
  transition: background-color 0.3s ease;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border: none;
  position: relative;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  @media (min-width: 768px) {
    padding: 20px 40px;
    font-size: 18px;
  }

  &.primary {
    background-color: var(--green-soft);
    color: #187536;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(123, 191, 138, 0.34);
      filter: brightness(1.03);
    }
  }

  &.secondary {
    background-color: var(--green-main);
    color: #ffffff;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(103, 181, 121, 0.34);
      filter: brightness(1.03);
    }
  }

  &.dark {
    background-color: #333;
    color: #ffffff;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(49, 95, 59, 0.38);
      filter: brightness(1.03);
    }
  }

  &.light {
    background-color: #ffffff;
    color: var(--green-dark);
    border: 1px solid var(--border-soft);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(140, 170, 147, 0.3);
      filter: brightness(1.03);
    }
  }

  &.yellow {
    background-color: #f2cf5b;
    color: #5a4a12;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(242, 207, 91, 0.38);
      filter: brightness(1.03);
    }
  }
}

.v-button.is-disabled {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

.button-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.button-content.is-hidden {
  opacity: 0;
}

.button-loader {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.button-loader span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: bounce 0.8s infinite ease-in-out;
}

.button-loader span:nth-child(2) {
  animation-delay: 0.12s;
}

.button-loader span:nth-child(3) {
  animation-delay: 0.24s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: translateY(-5px);
    opacity: 1;
  }
}
</style>
