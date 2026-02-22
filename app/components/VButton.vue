<template>
  <NuxtLink :to="href" :class="['v-button', type, customClass]" v-if="isButton">
    <slot></slot>
  </NuxtLink>
  <button :class="['v-button', type, customClass]" v-else>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  isButton: boolean;
  type: "primary" | "secondary" | "dark" | "light" | "yellow";
  href?: string;
  customClass?: string;
}>();
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
</style>
