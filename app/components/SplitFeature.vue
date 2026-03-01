<template>
  <div class="split-feature" :class="{ 'is-reversed': imageRight }">
    <div class="split-content">
      <h2 class="split-title">{{ title }}</h2>
      <ul class="split-list">
        <li v-for="(item, i) in items" :key="i" class="split-item">
          <Icon name="mdi:check-circle" class="split-check" />
          <span>{{ item }}</span>
        </li>
      </ul>
      <div v-if="$slots.actions" class="split-actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="split-media">
      <img :src="image" :alt="title" class="split-image" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    items: string[];
    image: string;
    imageRight?: boolean;
  }>(),
  {
    imageRight: true,
  },
);
</script>

<style lang="scss" scoped>
.split-feature {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.2rem;
  background: #fff;
  border-radius: 24px;
  padding: 3.2rem 2.4rem;
  box-shadow: 0 4px 24px rgba(180, 120, 100, 0.1);

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    align-items: center;
    padding: 4rem;
    gap: 5rem;
  }

  &.is-reversed {
    .split-media {
      @media (min-width: 768px) {
        order: 1;
      }
    }

    .split-content {
      @media (min-width: 768px) {
        order: 2;
      }
    }
  }
}

.split-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.split-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--dark-text);
  font-family: var(--font-title);
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (min-width: 768px) {
    font-size: 3.4rem;
  }
}

.split-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.split-item {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  font-size: 1.5rem;
  color: #3a4e3f;
  line-height: 1.5;
}

.split-check {
  font-size: 2.2rem;
  color: var(--green-main);
  flex-shrink: 0;
  margin-top: 1px;
}

.split-actions {
  margin-top: 0.8rem;
}

.split-media {
  width: 100%;
}

.split-image {
  width: 100%;
  height: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: 18px;
  display: block;
}
</style>
