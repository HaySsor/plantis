<template>
  <div class="input-box">
    <div class="input-box-top">
      <label :for="props.id">{{ props.label }}</label>
      <slot name="top" />
    </div>
    <div class="input-box-bottom">
      <Icon v-if="props.icon" :name="props.icon" class="input-icon" />
      <input
        :id="props.id"
        v-model="modelValue"
        :type="props.type || 'text'"
        :placeholder="props.placeholder || ''"
        :autocomplete="props.autocomplete || 'off'"
        :disabled="props.disabled || false"
        :required="props.required || false"
      />
      <span v-if="props.errorMessage" class="error-message">{{
        props.errorMessage
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<string>({ default: "" });

const props = defineProps<{
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon?: string;
  errorMessage?: string | null;
  autocomplete?: string;
  disabled?: boolean;
  required?: boolean;
}>();
</script>

<style scoped lang="scss">
.input-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-box-top {
  width: 100%;
  display: flex;
  position: relative;
  justify-content: space-between;
}

.input-box-bottom {
  display: flex;
  position: relative;
  flex-direction: column;
}

label {
  font-size: 16px;
  color: var(--gray-text);
  font-weight: 500;
  font-family: var(--font-title);
}

input {
  padding: 15px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  background-color: #f8fbf9;
  width: 100%;
  padding-left: 40px;
}

input:focus {
  outline: none;
  border-color: var(--green-main);
}

.error-message {
  color: lightcoral;
  font-size: 12px;
  margin-top: 4px;
}

.input-icon {
  position: absolute;
  left: 10px;
  font-size: 20px;
  color: var(--gray-text);
  top: 50%;
  transform: translateY(-50%);
}
</style>
