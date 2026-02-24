<template>
  <main class="auth-page">
    <div class="auth-image-side">
      <img :src="imageSrc" :alt="imageAlt" class="side-image" />
    </div>

    <div class="auth-form-side">
      <Icon name="mdi:leaf" width="40" height="40" class="form-icon" />
      <Icon
        name="mdi:leaf"
        width="40"
        height="40"
        class="form-icon form-icon-2"
      />

      <form class="form-container" @submit.prevent="$emit('submit')">
        <div class="form-header">
          <h3 class="form-title">{{ title }}</h3>
          <p class="form-subtitle">{{ subtitle }}</p>
        </div>

        <slot />

        <slot name="footer" />
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
defineEmits<{
  submit: [];
}>();

withDefaults(
  defineProps<{
    title: string;
    subtitle: string;
    imageSrc?: string;
    imageAlt?: string;
  }>(),
  {
    imageSrc: "/login-img.png",
    imageAlt: "Auth image",
  },
);
</script>

<style scoped lang="scss">
.auth-page {
  display: grid;
  height: 100%;
  min-height: 78svh;
  padding: 0 20px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    min-height: calc(100svh - 100px);
  }
}

.auth-image-side {
  display: none;

  @media (min-width: 768px) {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    max-height: calc(100svh - 120px);
  }
}

.side-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: inherit;
}

.auth-form-side {
  display: flex;
  justify-content: center;

  @media (min-width: 768px) {
    align-items: center;
    position: relative;
    height: 100%;
  }
}

.form-icon {
  display: none;

  @media (min-width: 768px) {
    display: block;
    position: absolute;
    top: 0%;
    left: 0%;
    color: var(--green-main);
    opacity: 0.2;
    font-size: 7rem;
  }
}

.form-icon-2 {
  @media (min-width: 768px) {
    top: 90%;
    left: 80%;
  }
}

.form-container {
  box-shadow: 0 10px 24px rgba(123, 191, 138, 0.34);
  width: 100%;
  min-height: 400px;
  border-radius: 25px;
  background-color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  height: max-content;

  @media (min-width: 768px) {
    padding: 40px;
    gap: 30px;
  }
}

.form-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--dark-text);
  font-family: var(--font-title);

  @media (min-width: 768px) {
    font-size: 32px;
  }
}

.form-subtitle {
  font-size: 14px;
  color: var(--gray-text);

  @media (min-width: 768px) {
    font-size: 16px;
  }
}

:deep(.input-link) {
  color: var(--green-main);
  font-size: 14px;
  font-weight: 500;
}

:deep(.input-link:hover) {
  text-decoration: underline;
}

:deep(.auth-reg-box) {
  display: flex;
  gap: 6px;
  justify-content: center;
  font-size: 14px;
  margin-top: 10px;
}
</style>
