<template>
  <main class="listing-detail">
    <NuxtLink to="/listings" class="back-link">
      <Icon name="mdi:arrow-left" />
      Wróć do ogłoszeń
    </NuxtLink>

    <div v-if="pending" class="state-box">
      <Icon name="mdi:loading" class="spin" />
      Ładowanie...
    </div>

    <div v-else-if="error || !listing" class="state-box">
      <Icon name="mdi:alert-circle-outline" class="error-icon" />
      <p>Nie znaleziono ogłoszenia.</p>
    </div>

    <div v-else class="detail-layout">
      <!-- Zdjęcia -->
      <div class="detail-gallery">
        <div v-if="listing.images?.length" class="gallery-grid" :class="`count-${listing.images.length}`">
          <img
            v-for="(img, i) in listing.images"
            :key="i"
            :src="img.url"
            :alt="`${listing.title} – zdjęcie ${i + 1}`"
            class="gallery-img"
          />
        </div>
        <div v-else class="gallery-placeholder">
          <Icon :name="typeIcon" class="placeholder-icon" />
        </div>
      </div>

      <!-- Info -->
      <div class="detail-info">
        <div class="info-badges">
          <span class="type-badge">{{ typeLabel }}</span>
          <span class="delivery-badge">
            <Icon :name="deliveryIcon" />
            {{ deliveryLabel }}
          </span>
        </div>

        <h1 class="detail-title">{{ listing.title }}</h1>

        <div class="detail-city">
          <Icon name="mdi:map-marker-outline" />
          {{ listing.city }}
        </div>

        <p class="detail-description">{{ listing.description }}</p>

        <!-- Atrybuty rośliny -->
        <div v-if="hasAttributes" class="plant-attrs">
          <div v-if="listing.watering" class="attr-chip">
            <Icon :name="wateringIcon" class="attr-icon" />
            {{ wateringLabel }}
          </div>
          <div v-if="listing.light" class="attr-chip">
            <Icon :name="lightIcon" class="attr-icon" />
            {{ lightLabel }}
          </div>
          <div v-if="listing.position" class="attr-chip">
            <Icon :name="positionIcon" class="attr-icon" />
            {{ positionLabel }}
          </div>
          <div v-if="listing.height" class="attr-chip">
            <Icon name="mdi:ruler" class="attr-icon" />
            {{ heightLabel }}
          </div>
          <div v-if="listing.difficulty" class="attr-chip">
            <Icon :name="difficultyIcon" class="attr-icon" />
            {{ difficultyLabel }}
          </div>
          <div v-if="listing.petFriendly !== null && listing.petFriendly !== undefined" class="attr-chip" :class="{ 'attr-pet-yes': listing.petFriendly, 'attr-pet-no': !listing.petFriendly }">
            <Icon :name="listing.petFriendly ? 'mdi:paw' : 'mdi:paw-off'" class="attr-icon" />
            {{ listing.petFriendly ? "Przyjazne dla zwierząt" : "Nieprzyjazne dla zwierząt" }}
          </div>
        </div>

        <div class="detail-date">
          Dodano {{ formatDate(listing.createdAt) }}
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const id = route.params.id as string;

const { data, pending, error } = await useFetch(`/api/listings/${id}`);
const listing = computed(() => data.value?.listing);

const typeLabel = computed(() => {
  const map: Record<string, string> = {
    PLANT: "Roślina",
    CUTTING: "Sadzonka",
    LEAF: "Liść",
    SEEDS: "Nasiona",
  };
  return map[listing.value?.type ?? ""] ?? listing.value?.type;
});

const typeIcon = computed(() => {
  const map: Record<string, string> = {
    PLANT: "mdi:flower",
    CUTTING: "mdi:sprout",
    LEAF: "mdi:leaf",
    SEEDS: "mdi:seed-outline",
  };
  return map[listing.value?.type ?? ""] ?? "mdi:flower";
});

const deliveryLabel = computed(() => {
  const map: Record<string, string> = {
    PICKUP: "Odbiór osobisty",
    SHIPPING: "Wysyłka",
    BOTH: "Odbiór lub wysyłka",
  };
  return map[listing.value?.deliveryMode ?? ""] ?? listing.value?.deliveryMode;
});

const deliveryIcon = computed(() => {
  const map: Record<string, string> = {
    PICKUP: "mdi:handshake-outline",
    SHIPPING: "mdi:package-variant-closed",
    BOTH: "mdi:check-all",
  };
  return map[listing.value?.deliveryMode ?? ""] ?? "mdi:truck-outline";
});

const hasAttributes = computed(() =>
  listing.value?.watering || listing.value?.light || listing.value?.position ||
  listing.value?.height || listing.value?.difficulty || listing.value?.petFriendly !== null
);

const wateringLabel = computed(() => ({ LOW: "Sucholubne", MEDIUM: "Umiarkowane", HIGH: "Wilgociolubne" })[listing.value?.watering ?? ""] ?? "");
const wateringIcon = computed(() => ({ LOW: "mdi:water-off", MEDIUM: "mdi:water", HIGH: "mdi:water-plus" })[listing.value?.watering ?? ""] ?? "mdi:water");

const lightLabel = computed(() => ({ LOW: "Cieniolubne", MEDIUM: "Półcień", HIGH: "Jasne stanowisko", FULL_SUN: "Pełne słońce" })[listing.value?.light ?? ""] ?? "");
const lightIcon = computed(() => ({ LOW: "mdi:weather-night", MEDIUM: "mdi:weather-partly-cloudy", HIGH: "mdi:weather-sunny", FULL_SUN: "mdi:white-balance-sunny" })[listing.value?.light ?? ""] ?? "mdi:weather-sunny");

const positionLabel = computed(() => ({ INDOOR: "Domowe", OUTDOOR: "Zewnętrzne", BOTH: "Domowe / Zewnętrzne" })[listing.value?.position ?? ""] ?? "");
const positionIcon = computed(() => ({ INDOOR: "mdi:home-outline", OUTDOOR: "mdi:tree-outline", BOTH: "mdi:home-variant-outline" })[listing.value?.position ?? ""] ?? "mdi:home-outline");

const heightLabel = computed(() => ({ SMALL: "do 30 cm", MEDIUM: "30–80 cm", LARGE: "powyżej 80 cm" })[listing.value?.height ?? ""] ?? "");

const difficultyLabel = computed(() => ({ EASY: "Łatwa uprawa", MEDIUM: "Średnia uprawa", HARD: "Trudna uprawa" })[listing.value?.difficulty ?? ""] ?? "");
const difficultyIcon = computed(() => ({ EASY: "mdi:emoticon-happy-outline", MEDIUM: "mdi:emoticon-neutral-outline", HARD: "mdi:emoticon-sad-outline" })[listing.value?.difficulty ?? ""] ?? "mdi:emoticon-neutral-outline");

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
</script>

<style lang="scss" scoped>
.listing-detail {
  max-width: 96rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.4rem;
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;

  &:hover {
    color: var(--green-dark);
  }
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

.spin {
  font-size: 3.2rem;
  animation: spin 0.8s linear infinite;
}

.error-icon {
  font-size: 4rem;
  color: var(--text-muted);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Layout ── */
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 2.4rem;
  }
}

/* ── Gallery ── */
.gallery-grid {
  display: grid;
  gap: 1rem;
  border-radius: 2rem;
  overflow: hidden;

  &.count-1 {
    grid-template-columns: 1fr;
  }

  &.count-2 {
    grid-template-columns: 1fr 1fr;
  }
}

.gallery-img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  display: block;
}

.gallery-placeholder {
  aspect-ratio: 3 / 4;
  background: linear-gradient(145deg, #d9f0d7, #b8e0bc);
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 8rem;
  color: #4a7c59;
  opacity: 0.4;
}

/* ── Info ── */
.detail-info {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.info-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  background: var(--green-soft);
  color: var(--green-dark);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.delivery-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  border: 1.5px solid var(--border-soft);
  color: var(--text-muted);
  font-size: 1.3rem;
  font-weight: 500;
}

.detail-title {
  font-family: var(--font-title);
  font-size: 3.2rem;
  font-weight: 700;
  color: var(--green-dark);
  margin: 0;
  line-height: 1.2;
}

.detail-city {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.5rem;
  color: var(--text-muted);
}

.detail-description {
  font-size: 1.6rem;
  color: var(--text-main);
  line-height: 1.7;
  margin: 0;
  white-space: pre-line;
}

.detail-date {
  font-size: 1.3rem;
  color: var(--text-muted);
  margin-top: auto;
}

.plant-attrs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.attr-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  border: 1.5px solid var(--border-soft);
  background: var(--surface);
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--text-muted);

  &.attr-pet-yes {
    border-color: #86efac;
    background: #f0fdf4;
    color: #166534;
  }

  &.attr-pet-no {
    border-color: #fca5a5;
    background: #fef2f2;
    color: #991b1b;
  }
}

.attr-icon {
  font-size: 1.5rem;
  color: var(--green-main);

  .attr-pet-no & {
    color: #ef4444;
  }
}
</style>
