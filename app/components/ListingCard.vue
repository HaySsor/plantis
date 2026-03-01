<template>
  <NuxtLink :to="`/listings/${id}`" class="listing-card">
    <div class="card-image">
      <img v-if="image" :src="image" :alt="title" class="card-img" />
      <div v-else class="card-img-placeholder">
        <Icon :name="typeIcon" class="placeholder-icon" />
      </div>

      <span class="card-title-badge">{{ title }}</span>

      <span class="card-meta-badge">
        <Icon name="mdi:map-marker-outline" class="meta-icon" />
        {{ city }}
        <span class="meta-dot" aria-hidden="true">·</span>
        <Icon :name="deliveryIcon" class="meta-icon" />
        {{ deliveryLabel }}
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string;
  title: string;
  type: string;
  city: string;
  deliveryMode: string;
  image?: string;
}>();

const typeIcon = computed(() => {
  const map: Record<string, string> = {
    PLANT: "mdi:flower",
    CUTTING: "mdi:sprout",
    LEAF: "mdi:leaf",
    SEEDS: "mdi:seed-outline",
  };
  return map[props.type] ?? "mdi:flower";
});

const deliveryIcon = computed(() => {
  const map: Record<string, string> = {
    PICKUP: "mdi:handshake-outline",
    SHIPPING: "mdi:package-variant-closed",
    BOTH: "mdi:check-all",
  };
  return map[props.deliveryMode] ?? "mdi:truck-outline";
});

const deliveryLabel = computed(() => {
  const map: Record<string, string> = {
    PICKUP: "Odbiór",
    SHIPPING: "Wysyłka",
    BOTH: "Odbiór / Wysyłka",
  };
  return map[props.deliveryMode] ?? props.deliveryMode;
});
</script>

<style lang="scss" scoped>
.listing-card {
  display: block;
  text-decoration: none;
  border-radius: 22px;
  overflow: hidden;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(60, 100, 70, 0.16);
  }
}

.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-img-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #d9f0d7, #b8e0bc);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 6.4rem;
  color: #4a7c59;
  opacity: 0.45;
}

.card-title-badge {
  position: absolute;
  top: 1.4rem;
  left: 1.4rem;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(6px);
  border-radius: 999px;
  padding: 0.55rem 1.2rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: #1d2f20;
  font-family: var(--font-title);
  max-width: calc(100% - 2.8rem);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-meta-badge {
  position: absolute;
  bottom: 1.4rem;
  right: 1.4rem;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(6px);
  border-radius: 999px;
  padding: 0.55rem 1.2rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: #3a4e3f;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.meta-icon {
  font-size: 1.5rem;
  color: #4a7c59;
}

.meta-dot {
  opacity: 0.4;
  font-size: 1.1rem;
}
</style>
