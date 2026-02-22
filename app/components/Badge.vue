<template>
  <div :class="['badge', { 'badge--uppercase': isUppercase }]">
    <Icon :name="icon" class="badge-icon" v-if="icon" />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const { color, textColor, icon, isUppercase } = defineProps({
  color: {
    type: String,
    default: "",
  },
  textColor: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  isUppercase: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 25px;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  color: v-bind(textColor);
  background-color: v-bind(color);

  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
}
.badge--uppercase {
  text-transform: uppercase;
}
.badge-icon {
  font-size: 1.6rem;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
}
</style>
