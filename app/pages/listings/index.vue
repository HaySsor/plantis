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
      <ListingCard
        v-for="item in listings"
        :key="item.id"
        :id="item.id"
        :title="item.title"
        :type="item.type"
        :city="item.city"
        :delivery-mode="item.deliveryMode"
        :image="item.images?.[0]?.url"
      />
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

</style>
