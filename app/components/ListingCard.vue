<template>
  <NuxtLink :to="`/listings/${id}`" class="listing-card">
    <!-- Top: location + heart -->
    <div class="card-top">
      <span class="card-location">
        <Icon name="mdi:map-marker-outline" class="loc-icon" />
        <strong>{{ city }}</strong>
        <span class="loc-dot">·</span>
        {{ deliveryLabel }}
      </span>
      <button
        class="card-fav"
        type="button"
        :class="{ 'is-active': isFavorite(id) }"
        @click.stop.prevent="toggle(id)"
      >
        <Icon :name="isFavorite(id) ? 'mdi:heart' : 'mdi:heart-outline'" />
      </button>
    </div>

    <!-- Image with rounded corners -->
    <div class="card-image-wrap">
      <img v-if="image" :src="image" :alt="title" class="card-img" />
      <div v-else class="card-img-placeholder">
        <Icon :name="typeIcon" class="placeholder-icon" />
      </div>

      <!-- Attribute chips overlay -->
      <div class="card-attrs">
        <ListingAttrChips
          variant="compact"
          :limit="2"
          :light="light"
          :difficulty="difficulty"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p v-if="description" class="card-desc">{{ description }}</p>
      <div v-if="ownerName" class="card-owner">
        <div class="owner-avatar">{{ ownerInitial }}</div>
        <div class="owner-meta">
          <span class="owner-name">{{ ownerName }}</span>
          <span class="owner-subtitle">Opiekun rośliny</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const { isFavorite, toggle, fetchFavorites } = useFavorites();
onMounted(fetchFavorites);

const props = defineProps<{
  id: string;
  title: string;
  type: string;
  city: string;
  deliveryMode: string;
  image?: string;
  description?: string;
  watering?: string | null;
  light?: string | null;
  difficulty?: string | null;
  ownerName?: string | null;
}>();

const ownerInitial = computed(
  () => props.ownerName?.charAt(0).toUpperCase() ?? "U",
);

const typeIcon = computed(() => {
  const map: Record<string, string> = {
    PLANT: "mdi:flower",
    CUTTING: "mdi:sprout",
    LEAF: "mdi:leaf",
    SEEDS: "mdi:seed-outline",
  };
  return map[props.type] ?? "mdi:flower";
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
  display: flex;
  flex-direction: column;
  text-decoration: none;
  background: #fff;
  border-radius: 2.4rem;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
  padding: 1.2rem 1.2rem 1.6rem;
  gap: 0;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(60, 100, 70, 0.14);
  }
}

/* ── Top bar ── */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0 0.2rem 1rem;
}

.card-location {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #f0f0ee;
  border-radius: 999px;
  padding: 0.8rem 1.1rem 0.8rem 0.8rem;
  font-size: 1.3rem;
  color: var(--green-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 4.8rem);

  strong {
    font-weight: 700;
  }
}

.loc-icon {
  font-size: 1.4rem;
  color: var(--green-main);
  flex-shrink: 0;
}

.loc-dot {
  opacity: 0.4;
  font-size: 1.1rem;
  font-weight: 400;
}

.card-fav {
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  border: 1.5px solid #e8e8e4;
  background: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  font-size: 1.9rem;
  color: var(--text-muted);
  flex-shrink: 0;
  transition:
    color 0.15s,
    background 0.15s,
    border-color 0.15s;

  &:hover {
    color: #e05a7a;
    border-color: #fca5a5;
  }

  &.is-active {
    color: #e05a7a;
    border-color: #fca5a5;
    background: #fef2f2;

    :deep(svg) {
      fill: currentColor;
    }
  }
}

/* ── Image ── */
.card-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 2;
  border-radius: 1.6rem;
  overflow: hidden;
  flex-shrink: 0;
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

/* ── Attribute chips on image ── */
.card-attrs {
  position: absolute;
  bottom: 1.2rem;
  left: 0;
  right: 0;
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem;
  justify-content: flex-end;
}

/* ── Content ── */
.card-content {
  padding: 1.2rem 0.4rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}

.card-title {
  font-family: var(--font-title);
  font-size: 2rem;
  font-weight: 600;
  color: var(--green-dark);
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc {
  font-size: 1.35rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-bottom: 0.5rem;
}

/* ── Owner ── */
.card-owner {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding-top: 0.8rem;
  border-top: 1px solid var(--border-soft);
}

.owner-avatar {
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  background: var(--green-soft);
  color: var(--green-dark);
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.owner-meta {
  display: flex;
  flex-direction: column;
}

.owner-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-main);
}

.owner-subtitle {
  font-size: 1.2rem;
  color: var(--text-muted);
}
</style>
