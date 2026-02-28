<template>
  <main class="listings-page">
    <ListingSearchBar
      :initial-query="q"
      :initial-location="city"
      @submit="onSearch"
    />

    <div class="listings-header">
      <h1>Oferty roślin</h1>
      <p class="listings-count" v-if="!pending">
        {{ total }} {{ pluralizeListings(total) }}
      </p>
    </div>

    <!-- Filtry typów -->
    <div class="type-filters">
      <button
        class="type-chip"
        :class="{ active: !activeType }"
        @click="setType('')"
      >
        <Icon name="mdi:all-inclusive" />
        Wszystkie
      </button>
      <button
        v-for="opt in typeOptions"
        :key="opt.value"
        class="type-chip"
        :class="{ active: activeType === opt.value }"
        @click="setType(opt.value)"
      >
        <Icon :name="opt.icon" />
        {{ opt.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="state-box">
      <Icon name="mdi:loading" class="spin" />
      Ładowanie ogłoszeń...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-box">
      Nie udało się załadować ogłoszeń.
    </div>

    <!-- Empty -->
    <div v-else-if="listings.length === 0" class="state-box">
      <Icon name="mdi:sprout" class="empty-icon" />
      <p>Brak ogłoszeń spełniających kryteria.</p>
    </div>

    <!-- Grid -->
    <div v-else class="listings-grid">
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
          <span class="card-type-badge" :class="item.type.toLowerCase()">
            {{ typeLabel(item.type) }}
          </span>
          <p class="card-title">{{ item.title }}</p>
          <div class="card-meta">
            <span>
              <Icon name="mdi:map-marker" />
              {{ item.city }}
            </span>
            <span>
              <Icon :name="deliveryIcon(item.deliveryMode)" />
              {{ deliveryLabel(item.deliveryMode) }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const q = ref((route.query.q as string) ?? "");
const city = ref((route.query.city as string) ?? "");
const activeType = ref((route.query.type as string) ?? "");

const typeOptions = [
  { value: "PLANT", label: "Roślina", icon: "mdi:flower" },
  { value: "CUTTING", label: "Sadzonka", icon: "mdi:sprout" },
  { value: "LEAF", label: "Liść", icon: "mdi:leaf" },
  { value: "SEEDS", label: "Nasiona", icon: "mdi:seed" },
];

const { data, pending, error } = await useFetch("/api/listings", {
  query: computed(() => ({
    q: q.value || undefined,
    city: city.value || undefined,
    type: activeType.value || undefined,
  })),
});

const listings = computed(() => data.value?.items ?? []);
const total = computed(() => data.value?.total ?? 0);

function syncUrl() {
  router.replace({
    query: {
      q: q.value || undefined,
      city: city.value || undefined,
      type: activeType.value || undefined,
    },
  });
}

function onSearch(payload: { query: string; location: string }) {
  q.value = payload.query;
  city.value = payload.location;
  syncUrl();
}

function setType(type: string) {
  activeType.value = type;
  syncUrl();
}

function pluralizeListings(n: number) {
  if (n === 1) return "ogłoszenie";
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20))
    return "ogłoszenia";
  return "ogłoszeń";
}

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
.listings-page {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.listings-header {
  display: flex;
  align-items: baseline;
  gap: 1.2rem;
  flex-wrap: wrap;
}

h1 {
  font-size: 3.2rem;
  color: var(--green-dark);
  margin: 0;
}

.listings-count {
  font-size: 1.6rem;
  color: var(--text-muted);
}

/* ── Type chips ── */
.type-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.4rem;
  border-radius: 10rem;
  border: 2px solid var(--border-soft);
  background: var(--surface);
  font-size: 1.4rem;
  font-family: var(--font-ui);
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s;

  &:hover {
    border-color: var(--green-main);
    color: var(--green-dark);
  }

  &.active {
    border-color: var(--green-main);
    background: var(--green-soft);
    color: var(--green-dark);
    font-weight: 600;
  }
}

/* ── States ── */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  padding: 4rem 2rem;
  font-size: 1.6rem;
  color: var(--text-muted);
  text-align: center;
}

.empty-icon {
  font-size: 4.8rem;
  color: var(--green-main);
}

.spin {
  font-size: 3.2rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Grid ── */
.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
  gap: 1.6rem;
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
}

.card-image-placeholder {
  height: 14rem;
  background: var(--green-soft);
  display: grid;
  place-items: center;
}

.type-icon {
  font-size: 5.6rem;
  color: var(--green-dark);
  opacity: 0.5;
}

.card-body {
  padding: 1.4rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.card-type-badge {
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
  font-size: 1.6rem;
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
  gap: 1.2rem;
  flex-wrap: wrap;
  font-size: 1.3rem;
  color: var(--text-muted);

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
}
</style>
