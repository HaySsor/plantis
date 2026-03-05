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

      <button class="type-chip filter-toggle" :class="{ active: showAdvanced }" @click="showAdvanced = !showAdvanced">
        <Icon name="mdi:filter-variant" />
        Filtry
        <span v-if="advancedFilterCount > 0" class="filter-badge">{{ advancedFilterCount }}</span>
      </button>

      <button v-if="hasFilters" class="type-chip clear-chip" @click="clearFilters">
        <Icon name="mdi:close" />
        Wyczyść filtry
      </button>
    </div>

    <!-- Zaawansowane filtry -->
    <div v-if="showAdvanced" class="advanced-filters">
      <div class="filter-group">
        <span class="filter-group-label">Podlewanie</span>
        <div class="filter-chips">
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

      <div class="filter-group">
        <span class="filter-group-label">Światło</span>
        <div class="filter-chips">
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

      <div class="filter-group">
        <span class="filter-group-label">Stanowisko</span>
        <div class="filter-chips">
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

      <div class="filter-group">
        <span class="filter-group-label">Wysokość</span>
        <div class="filter-chips">
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

      <div class="filter-group">
        <span class="filter-group-label">Trudność</span>
        <div class="filter-chips">
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

      <div class="filter-group">
        <span class="filter-group-label">Zwierzęta</span>
        <div class="filter-chips">
          <button class="type-chip" :class="{ active: activePetFriendly === 'true' }" @click="toggle('petFriendly', 'true')">
            <Icon name="mdi:paw" />
            Przyjazne
          </button>
          <button class="type-chip" :class="{ active: activePetFriendly === 'false' }" @click="toggle('petFriendly', 'false')">
            <Icon name="mdi:paw-off" />
            Nieprzyjazne
          </button>
        </div>
      </div>
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

const q               = ref((route.query.q               as string) ?? "");
const city            = ref((route.query.city            as string) ?? "");
const activeType      = ref((route.query.type            as string) ?? "");
const activeWatering  = ref((route.query.watering        as string) ?? "");
const activeLight     = ref((route.query.light           as string) ?? "");
const activePosition  = ref((route.query.position        as string) ?? "");
const activeHeight    = ref((route.query.height          as string) ?? "");
const activeDifficulty = ref((route.query.difficulty     as string) ?? "");
const activePetFriendly = ref((route.query.petFriendly  as string) ?? "");

const showAdvanced = ref(
  !!(activeWatering.value || activeLight.value || activePosition.value ||
     activeHeight.value || activeDifficulty.value || activePetFriendly.value)
);

const typeOptions = [
  { value: "PLANT",   label: "Roślina",  icon: "mdi:flower" },
  { value: "CUTTING", label: "Sadzonka", icon: "mdi:sprout" },
  { value: "LEAF",    label: "Liść",     icon: "mdi:leaf"   },
  { value: "SEEDS",   label: "Nasiona",  icon: "mdi:seed"   },
];

const wateringOptions = [
  { value: "LOW",    label: "Sucholubne",    icon: "mdi:water-off"  },
  { value: "MEDIUM", label: "Umiarkowane",   icon: "mdi:water"      },
  { value: "HIGH",   label: "Wilgociolubne", icon: "mdi:water-plus" },
];

const lightOptions = [
  { value: "LOW",      label: "Cieniolubne",     icon: "mdi:weather-night"         },
  { value: "MEDIUM",   label: "Półcień",          icon: "mdi:weather-partly-cloudy" },
  { value: "HIGH",     label: "Jasne stanowisko", icon: "mdi:weather-sunny"         },
  { value: "FULL_SUN", label: "Pełne słońce",     icon: "mdi:white-balance-sunny"   },
];

const positionOptions = [
  { value: "INDOOR",  label: "Domowe",      icon: "mdi:home-outline"         },
  { value: "OUTDOOR", label: "Zewnętrzne",  icon: "mdi:tree-outline"         },
  { value: "BOTH",    label: "Oba",         icon: "mdi:home-variant-outline" },
];

const heightOptions = [
  { value: "SMALL",  label: "do 30 cm"       },
  { value: "MEDIUM", label: "30–80 cm"        },
  { value: "LARGE",  label: "powyżej 80 cm"  },
];

const difficultyOptions = [
  { value: "EASY",   label: "Łatwa",   icon: "mdi:emoticon-happy-outline"   },
  { value: "MEDIUM", label: "Średnia", icon: "mdi:emoticon-neutral-outline" },
  { value: "HARD",   label: "Trudna",  icon: "mdi:emoticon-sad-outline"     },
];

const { data, pending, error } = await useFetch("/api/listings", {
  query: computed(() => ({
    q:           q.value             || undefined,
    city:        city.value          || undefined,
    type:        activeType.value    || undefined,
    watering:    activeWatering.value   || undefined,
    light:       activeLight.value      || undefined,
    position:    activePosition.value   || undefined,
    height:      activeHeight.value     || undefined,
    difficulty:  activeDifficulty.value || undefined,
    petFriendly: activePetFriendly.value || undefined,
  })),
});

const listings = computed(() => data.value?.items ?? []);
const total    = computed(() => data.value?.total ?? 0);

const advancedFilterCount = computed(() =>
  [activeWatering, activeLight, activePosition, activeHeight, activeDifficulty, activePetFriendly]
    .filter(r => !!r.value).length
);

const hasFilters = computed(() =>
  !!q.value || !!city.value || !!activeType.value || advancedFilterCount.value > 0
);

function syncUrl() {
  router.replace({
    query: {
      q:           q.value             || undefined,
      city:        city.value          || undefined,
      type:        activeType.value    || undefined,
      watering:    activeWatering.value   || undefined,
      light:       activeLight.value      || undefined,
      position:    activePosition.value   || undefined,
      height:      activeHeight.value     || undefined,
      difficulty:  activeDifficulty.value || undefined,
      petFriendly: activePetFriendly.value || undefined,
    },
  });
}

function onSearch(payload: { query: string; location: string }) {
  q.value    = payload.query;
  city.value = payload.location;
  syncUrl();
}

function setType(type: string) {
  activeType.value = type;
  syncUrl();
}

type FilterKey = "watering" | "light" | "position" | "height" | "difficulty" | "petFriendly";
const filterRefs: Record<FilterKey, ReturnType<typeof ref<string>>> = {
  watering:    activeWatering,
  light:       activeLight,
  position:    activePosition,
  height:      activeHeight,
  difficulty:  activeDifficulty,
  petFriendly: activePetFriendly,
};

function toggle(key: FilterKey, value: string) {
  filterRefs[key].value = filterRefs[key].value === value ? "" : value;
  syncUrl();
}

function clearFilters() {
  q.value = ""; city.value = ""; activeType.value = "";
  activeWatering.value = ""; activeLight.value = ""; activePosition.value = "";
  activeHeight.value = ""; activeDifficulty.value = ""; activePetFriendly.value = "";
  syncUrl();
}

function pluralizeListings(n: number) {
  if (n === 1) return "ogłoszenie";
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return "ogłoszenia";
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
  transition: border-color 0.15s, background 0.15s, color 0.15s;

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

  &.clear-chip {
    border-color: #fca5a5;
    color: #b91c1c;
    margin-left: auto;

    &:hover {
      border-color: #ef4444;
      background: #fef2f2;
      color: #b91c1c;
    }
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
  line-height: 1;
}

/* ── Advanced filters ── */
.advanced-filters {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  padding: 1.6rem 2rem;
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 1.6rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.filter-group-label {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-muted);
  min-width: 9rem;
  flex-shrink: 0;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
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
  to { transform: rotate(360deg); }
}

/* ── Grid ── */
.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 300px));
  justify-content: center;
  gap: 1.2rem;

  @media (min-width: 768px) {
    justify-content: start;
  }
}
</style>
