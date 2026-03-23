<template>
  <main class="listings-page">
    <ListingSearchBar
      :initial-query="q"
      :initial-location="city"
      @submit="onSearch"
    />

    <!-- Mobile: pasek z przyciskiem filtrów -->
    <div class="mobile-bar">
      <div class="type-chips-row">
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
      <button
        class="filter-toggle-btn"
        :class="{ active: mobileFiltersOpen }"
        @click="mobileFiltersOpen = !mobileFiltersOpen"
      >
        <Icon name="mdi:filter-variant" />
        Filtry
        <span v-if="advancedFilterCount > 0" class="filter-badge">{{
          advancedFilterCount
        }}</span>
      </button>
    </div>

    <!-- Mobile: rozwijane filtry -->
    <div v-if="mobileFiltersOpen" class="mobile-filters">
      <FilterSidebar
        :active-watering="activeWatering"
        :active-light="activeLight"
        :active-position="activePosition"
        :active-height="activeHeight"
        :active-difficulty="activeDifficulty"
        :active-pet-friendly="activePetFriendly"
        :has-filters="hasFilters"
        @toggle="onSidebarToggle"
        @clear="clearFilters"
      />
    </div>

    <!-- Desktop: sidebar + grid -->
    <div class="listings-layout">
      <!-- Sidebar (desktop only) -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <span class="sidebar-label">Typ</span>
          <div class="sidebar-chips">
            <button
              class="type-chip"
              :class="{ active: !activeType }"
              @click="setType('')"
            >
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
        </div>

        <div class="sidebar-section">
          <span class="sidebar-label">Podlewanie</span>
          <div class="sidebar-chips">
            <button
              v-for="opt in wateringOptions"
              :key="opt.value"
              class="type-chip"
              :class="{ active: activeWatering === opt.value }"
              @click="toggle('watering', opt.value)"
            >
              <Icon :name="opt.icon" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <span class="sidebar-label">Światło</span>
          <div class="sidebar-chips">
            <button
              v-for="opt in lightOptions"
              :key="opt.value"
              class="type-chip"
              :class="{ active: activeLight === opt.value }"
              @click="toggle('light', opt.value)"
            >
              <Icon :name="opt.icon" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <span class="sidebar-label">Stanowisko</span>
          <div class="sidebar-chips">
            <button
              v-for="opt in positionOptions"
              :key="opt.value"
              class="type-chip"
              :class="{ active: activePosition === opt.value }"
              @click="toggle('position', opt.value)"
            >
              <Icon :name="opt.icon" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <span class="sidebar-label">Wysokość</span>
          <div class="sidebar-chips">
            <button
              v-for="opt in heightOptions"
              :key="opt.value"
              class="type-chip"
              :class="{ active: activeHeight === opt.value }"
              @click="toggle('height', opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <span class="sidebar-label">Trudność</span>
          <div class="sidebar-chips">
            <button
              v-for="opt in difficultyOptions"
              :key="opt.value"
              class="type-chip"
              :class="{ active: activeDifficulty === opt.value }"
              @click="toggle('difficulty', opt.value)"
            >
              <Icon :name="opt.icon" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <span class="sidebar-label">Zwierzęta</span>
          <div class="sidebar-chips">
            <button
              class="type-chip"
              :class="{ active: activePetFriendly === 'true' }"
              @click="toggle('petFriendly', 'true')"
            >
              <Icon name="mdi:paw" /> Przyjazne
            </button>
            <button
              class="type-chip"
              :class="{ active: activePetFriendly === 'false' }"
              @click="toggle('petFriendly', 'false')"
            >
              <Icon name="mdi:paw-off" /> Nieprzyjazne
            </button>
          </div>
        </div>

        <button v-if="hasFilters" class="clear-btn" @click="clearFilters">
          <Icon name="mdi:close" />
          Wyczyść filtry
        </button>
      </aside>

      <!-- Prawa strona -->
      <div class="listings-main">
        <div class="listings-header">
          <p class="listings-count">
            <template v-if="!isInitialLoad">
              {{ stableTotal }} {{ pluralizeListings(stableTotal) }}
            </template>
          </p>
        </div>

        <!-- Skeleton loading: tylko przy pierwszym wczytaniu (brak danych) -->
        <div v-if="isInitialLoad" class="listings-grid">
          <ListingCardSkeleton v-for="n in 12" :key="n" />
        </div>

        <!-- Error -->
        <div v-else-if="error" class="state-box">
          Nie udało się załadować ogłoszeń.
        </div>

        <!-- Empty -->
        <div
          v-else-if="!pending && stableListings.length === 0"
          class="state-box"
        >
          <Icon name="mdi:sprout" class="empty-icon" />
          <p>Brak ogłoszeń spełniających kryteria.</p>
        </div>

        <!-- Grid: przy odświeżaniu pokazuje stare dane z opacity -->
        <div
          v-else
          class="listings-grid"
          :class="{ 'listings-grid--refreshing': isRefreshing }"
        >
          <ListingCard
            v-for="item in stableListings"
            :key="item.id"
            :id="item.id"
            :title="item.title"
            :type="item.type"
            :city="item.city"
            :delivery-mode="item.deliveryMode"
            :image="item.images?.[0]?.url"
            :description="item.description"
            :watering="item.watering"
            :light="item.light"
            :difficulty="item.difficulty"
            :owner-name="item.user?.name"
          />
        </div>

        <!-- Paginacja -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="page-btn page-btn--arrow"
            :disabled="page === 1"
            @click="goTo(page - 1)"
          >
            <Icon name="mdi:chevron-left" />
          </button>

          <template v-for="p in pageNumbers" :key="p">
            <span v-if="p === '...'" class="page-dots">…</span>
            <button
              v-else
              class="page-btn"
              :class="{ active: p === page }"
              @click="goTo(p as number)"
            >
              {{ p }}
            </button>
          </template>

          <button
            class="page-btn page-btn--arrow"
            :disabled="page === totalPages"
            @click="goTo(page + 1)"
          >
            <Icon name="mdi:chevron-right" />
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const q = ref((route.query.q as string) ?? "");
const city = ref((route.query.city as string) ?? "");
const activeType = ref((route.query.type as string) ?? "");
const activeWatering = ref((route.query.watering as string) ?? "");
const activeLight = ref((route.query.light as string) ?? "");
const activePosition = ref((route.query.position as string) ?? "");
const activeHeight = ref((route.query.height as string) ?? "");
const activeDifficulty = ref((route.query.difficulty as string) ?? "");
const activePetFriendly = ref((route.query.petFriendly as string) ?? "");

const mobileFiltersOpen = ref(false);
const page = ref(Number(route.query.page ?? 1));

const typeOptions = [
  { value: "PLANT", label: "Roślina", icon: "mdi:flower" },
  { value: "CUTTING", label: "Sadzonka", icon: "mdi:sprout" },
  { value: "LEAF", label: "Liść", icon: "mdi:leaf" },
  { value: "SEEDS", label: "Nasiona", icon: "mdi:seed" },
];

const wateringOptions = [
  { value: "LOW", label: "Sucholubne", icon: "mdi:water-off" },
  { value: "MEDIUM", label: "Umiarkowane", icon: "mdi:water" },
  { value: "HIGH", label: "Wilgociolubne", icon: "mdi:water-plus" },
];

const lightOptions = [
  { value: "LOW", label: "Cieniolubne", icon: "mdi:weather-night" },
  { value: "MEDIUM", label: "Półcień", icon: "mdi:weather-partly-cloudy" },
  { value: "HIGH", label: "Jasne", icon: "mdi:weather-sunny" },
  { value: "FULL_SUN", label: "Pełne słońce", icon: "mdi:white-balance-sunny" },
];

const positionOptions = [
  { value: "INDOOR", label: "Domowe", icon: "mdi:home-outline" },
  { value: "OUTDOOR", label: "Zewnętrzne", icon: "mdi:tree-outline" },
  { value: "BOTH", label: "Oba", icon: "mdi:home-variant-outline" },
];

const heightOptions = [
  { value: "SMALL", label: "do 30 cm" },
  { value: "MEDIUM", label: "30–80 cm" },
  { value: "LARGE", label: "pow. 80 cm" },
];

const difficultyOptions = [
  { value: "EASY", label: "Łatwa", icon: "mdi:emoticon-happy-outline" },
  { value: "MEDIUM", label: "Średnia", icon: "mdi:emoticon-neutral-outline" },
  { value: "HARD", label: "Trudna", icon: "mdi:emoticon-sad-outline" },
];

type ListingItem = {
  id: string;
  title: string;
  description: string;
  city: string;
  type: string;
  deliveryMode: string;
  watering: string | null;
  light: string | null;
  difficulty: string | null;
  createdAt: string;
  images: { url: string; order: number }[];
  user: { name: string } | null;
};

const { data, pending, error } = await useFetch<{
  page: number;
  pageSize: number;
  total: number;
  items: ListingItem[];
}>("/api/listings", {
  query: computed(() => ({
    q: q.value || undefined,
    city: city.value || undefined,
    type: activeType.value || undefined,
    watering: activeWatering.value || undefined,
    light: activeLight.value || undefined,
    position: activePosition.value || undefined,
    height: activeHeight.value || undefined,
    difficulty: activeDifficulty.value || undefined,
    petFriendly: activePetFriendly.value || undefined,
    page: page.value > 1 ? page.value : undefined,
  })),
});

const total = computed(() => data.value?.total ?? 0);

// Trzymamy ostatnie znane dane — nie znikają podczas odświeżania
const stableListings = ref<ListingItem[]>([]);
const stableTotal = ref(0);
watch(
  data,
  (val) => {
    if (val) {
      stableListings.value = val.items;
      stableTotal.value = val.total;
    }
  },
  { immediate: true },
);

const isInitialLoad = computed(
  () => pending.value && stableListings.value.length === 0,
);
const isRefreshing = computed(
  () => pending.value && stableListings.value.length > 0,
);
const pageSize = computed(() => data.value?.pageSize ?? 12);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value)),
);

const pageNumbers = computed(() => {
  const tot = totalPages.value;
  const cur = page.value;
  if (tot <= 7) return Array.from({ length: tot }, (_, i) => i + 1);
  const pages: (number | string)[] = [1];
  if (cur > 3) pages.push("...");
  for (let i = Math.max(2, cur - 1); i <= Math.min(tot - 1, cur + 1); i++)
    pages.push(i);
  if (cur < tot - 2) pages.push("...");
  pages.push(tot);
  return pages;
});

function goTo(p: number) {
  page.value = p;
  syncUrl();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const advancedFilterCount = computed(
  () =>
    [
      activeWatering,
      activeLight,
      activePosition,
      activeHeight,
      activeDifficulty,
      activePetFriendly,
    ].filter((r) => !!r.value).length,
);

const hasFilters = computed(
  () =>
    !!q.value ||
    !!city.value ||
    !!activeType.value ||
    advancedFilterCount.value > 0,
);

function syncUrl(resetPage = false) {
  if (resetPage) page.value = 1;
  router.replace({
    query: {
      q: q.value || undefined,
      city: city.value || undefined,
      type: activeType.value || undefined,
      watering: activeWatering.value || undefined,
      light: activeLight.value || undefined,
      position: activePosition.value || undefined,
      height: activeHeight.value || undefined,
      difficulty: activeDifficulty.value || undefined,
      petFriendly: activePetFriendly.value || undefined,
      page: page.value > 1 ? page.value : undefined,
    },
  });
}

function onSearch(payload: { query: string; location: string }) {
  q.value = payload.query;
  city.value = payload.location;
  syncUrl(true);
}

function setType(type: string) {
  activeType.value = type;
  syncUrl(true);
}

type FilterKey =
  | "watering"
  | "light"
  | "position"
  | "height"
  | "difficulty"
  | "petFriendly";
const filterRefs: Record<FilterKey, ReturnType<typeof ref<string>>> = {
  watering: activeWatering,
  light: activeLight,
  position: activePosition,
  height: activeHeight,
  difficulty: activeDifficulty,
  petFriendly: activePetFriendly,
};

function onSidebarToggle(key: string, value: string) {
  toggle(key as FilterKey, value);
}

function toggle(key: FilterKey, value: string) {
  filterRefs[key].value = filterRefs[key].value === value ? "" : value;
  syncUrl(true);
}

function clearFilters() {
  q.value = "";
  city.value = "";
  activeType.value = "";
  activeWatering.value = "";
  activeLight.value = "";
  activePosition.value = "";
  activeHeight.value = "";
  activeDifficulty.value = "";
  activePetFriendly.value = "";
  syncUrl(true);
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
  gap: 2rem;
}

/* ── Mobile bar ── */
.mobile-bar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-wrap: wrap;

  @media (min-width: 1024px) {
    display: none;
  }
}

.type-chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  flex: 1;
}

.filter-toggle-btn {
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
  width: fit-content;
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s;
  flex-shrink: 0;

  &.active,
  &:hover {
    border-color: var(--green-main);
    background: var(--green-soft);
    color: var(--green-dark);
  }
}

.mobile-filters {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 1.6rem;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0;

  @media (min-width: 1024px) {
    display: none;
  }
}

.mob-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid var(--border-soft);

  &:last-of-type {
    border-bottom: none;
  }
}

.mob-label {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.mob-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

/* ── Desktop layout ── */
.listings-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 24rem 1fr;
    align-items: start;
    gap: 2.8rem;
  }
}

/* ── Sidebar ── */
.sidebar {
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    background: var(--surface);
    border: 1px solid var(--border-soft);
    border-radius: 2rem;
    padding: 2rem 1.6rem;
  }
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid var(--border-soft);

  &:last-of-type {
    border-bottom: none;
  }
}

.sidebar-label {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.sidebar-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.8rem;
  padding: 0.7rem 1.2rem;
  border-radius: 10rem;
  border: 1.5px solid #fca5a5;
  background: transparent;
  font-size: 1.3rem;
  font-family: var(--font-ui);
  font-weight: 500;
  color: #b91c1c;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #fef2f2;
  }
}

/* ── Shared chip ── */
.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 10rem;
  border: 2px solid var(--border-soft);
  background: var(--surface);
  font-size: 1.3rem;
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

.filter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  background: var(--green-dark);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
}

/* ── Main content ── */
.listings-main {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.listings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.listings-count {
  font-size: 1.5rem;
  color: var(--text-muted);
}

/* ── States ── */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  padding: 6rem 2rem;
  font-size: 1.6rem;
  color: var(--text-muted);
  text-align: center;
}

.empty-icon {
  font-size: 4.8rem;
  color: var(--green-main);
  opacity: 0.5;
}

/* ── Grid ── */
.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.6rem;

  &--refreshing {
    opacity: 0.45;
    pointer-events: none;
    transition: opacity 0.2s;
  }
}

/* ── Pagination ── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding-top: 1.6rem;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.8rem;
  height: 3.8rem;
  padding: 0 1rem;
  border-radius: 1rem;
  border: 1.5px solid var(--border-soft);
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

  &:hover:not(:disabled) {
    border-color: var(--green-main);
    color: var(--green-dark);
  }

  &.active {
    border-color: var(--green-main);
    background: var(--green-dark);
    color: #fff;
    font-weight: 700;
    pointer-events: none;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &--arrow {
    font-size: 1.8rem;
  }
}

.page-dots {
  font-size: 1.4rem;
  color: var(--text-muted);
  padding: 0 0.4rem;
  user-select: none;
}
</style>
