<template>
  <section class="recent-listings">
    <div class="recent-header">
      <h2>Ostatnio dodane</h2>
      <NuxtLink to="/listings" class="see-all">
        Zobacz wszystkie
        <Icon name="mdi:arrow-right" />
      </NuxtLink>
    </div>

    <div v-if="pending" class="recent-grid">
      <div v-for="n in 4" :key="n" class="listing-card skeleton" />
    </div>

    <div v-else-if="listings.length" class="recent-grid">
      <NuxtLink
        v-for="item in listings"
        :key="item.id"
        :to="`/listings/${item.id}`"
        class="listing-card"
      >
        <div class="card-image-placeholder">
          <Icon :name="typeIcon(item.type)" class="type-icon" />
        </div>
        <div class="card-body">
          <span class="card-badge" :class="item.type.toLowerCase()">
            {{ typeLabel(item.type) }}
          </span>
          <p class="card-title">{{ item.title }}</p>
          <div class="card-meta">
            <span><Icon name="mdi:map-marker" />{{ item.city }}</span>
            <span
              ><Icon :name="deliveryIcon(item.deliveryMode)" />{{
                deliveryLabel(item.deliveryMode)
              }}</span
            >
          </div>
        </div>
      </NuxtLink>
    </div>

    <p v-else class="empty">Brak ogłoszeń. Bądź pierwszy!</p>
  </section>
</template>

<script setup lang="ts">
const { data, pending } = await useFetch("/api/listings", {
  query: { pageSize: 4 },
});

const listings = computed(() => data.value?.items ?? []);

function typeLabel(type: string) {
  const map: Record<string, string> = {
    PLANT: "Roślina",
    CUTTING: "Sadzonka",
    LEAF: "Liść",
    SEEDS: "Nasiona",
  };
  return map[type] ?? type;
}

function typeIcon(type: string) {
  const map: Record<string, string> = {
    PLANT: "mdi:flower",
    CUTTING: "mdi:sprout",
    LEAF: "mdi:leaf",
    SEEDS: "mdi:seed",
  };
  return map[type] ?? "mdi:flower";
}

function deliveryLabel(mode: string) {
  const map: Record<string, string> = {
    PICKUP: "Odbiór",
    SHIPPING: "Wysyłka",
    BOTH: "Odbiór / Wysyłka",
  };
  return map[mode] ?? mode;
}

function deliveryIcon(mode: string) {
  const map: Record<string, string> = {
    PICKUP: "mdi:handshake",
    SHIPPING: "mdi:package-variant",
    BOTH: "mdi:check-all",
  };
  return map[mode] ?? "mdi:truck";
}
</script>

<style lang="scss" scoped>
.recent-listings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
}

.recent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h2 {
  font-size: 2.4rem;
  font-family: var(--font-title);
  color: var(--green-dark);
  margin: 0;
}

.see-all {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--green-dark);
  transition: gap 0.15s;

  &:hover {
    gap: 0.8rem;
  }
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 300px));

  gap: 1.2rem;
}

.listing-card {
  display: flex;
  flex-direction: column;
  border-radius: 1.6rem;
  border: 1px solid var(--border-soft);
  background: var(--surface);
  overflow: hidden;
  text-decoration: none;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(123, 191, 138, 0.2);
  }

  &.skeleton {
    height: 20rem;
    background: linear-gradient(90deg, #e8f4ea 25%, #f0f8f1 50%, #e8f4ea 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    pointer-events: none;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.card-image-placeholder {
  height: 12rem;
  background: var(--green-soft);
  display: grid;
  place-items: center;
}

.type-icon {
  font-size: 4.8rem;
  color: var(--green-dark);
  opacity: 0.4;
}

.card-body {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-badge {
  display: inline-block;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.3rem 0.9rem;
  border-radius: 10rem;
  width: fit-content;
  background: var(--green-soft);
  color: var(--green-dark);

  &.cutting {
    background: #fef9c3;
    color: #78610a;
  }
  &.leaf {
    background: #dcfce7;
    color: #166534;
  }
  &.seeds {
    background: #fce7f3;
    color: #9d174d;
  }
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  font-family: var(--font-title);
  color: var(--text-main);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 1.2rem;
  color: var(--text-muted);

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
}

.empty {
  font-size: 1.6rem;
  color: var(--text-muted);
  text-align: center;
  padding: 2rem;
}
</style>
