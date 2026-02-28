<template>
  <div class="step-card">
    <div class="step-icon-wrap">
      <Icon :name="icon" class="step-icon" />
      <span class="step-badge">
        <Icon :name="badgeIcon" class="step-badge-icon" />
      </span>
    </div>
    <h3 class="step-title">{{ title }}</h3>
    <p class="step-description">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string;
    badgeIcon?: string;
    title: string;
    description: string;
  }>(),
  {
    badgeIcon: "mdi:sprout",
  },
);
</script>

<style lang="scss" scoped>
.step-card {
  background: #fff;
  border-radius: 24px;
  padding: 2.8rem 2.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.6rem;
  box-shadow: 0 4px 24px rgba(180, 120, 100, 0.1);
}

.step-icon-wrap {
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #f0f0ed;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-icon {
  font-size: 3.8rem;
  color: #4a7c59;
}

.step-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff;
  border: 5px solid #f0f0ed;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-badge-icon {
  font-size: 1.4rem;
  color: #4a7c59;
}

.step-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-text);
  font-family: var(--font-title);
  letter-spacing: -0.02em;
}

.step-description {
  font-size: 1.6rem;
  color: var(--gray-text);
  line-height: 26px;
  max-width: 280px;
}
</style>
