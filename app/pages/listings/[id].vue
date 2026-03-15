<template>
  <main class="listing-detail">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <NuxtLink to="/">Główna</NuxtLink>
      <Icon name="mdi:chevron-right" class="breadcrumb-sep" />
      <NuxtLink to="/listings">Oferty</NuxtLink>
      <Icon name="mdi:chevron-right" class="breadcrumb-sep" />
      <span class="breadcrumb-current">{{ listing?.title ?? "..." }}</span>
    </nav>

    <!-- Loading -->
    <div v-if="pending" class="state-box">
      <Icon name="mdi:loading" class="spin" />
      Ładowanie...
    </div>

    <!-- Error -->
    <div v-else-if="error || !listing" class="state-box">
      <Icon name="mdi:alert-circle-outline" class="error-icon" />
      <p>Nie znaleziono ogłoszenia.</p>
    </div>

    <!-- Content -->
    <div v-else class="detail-layout">
      <!-- ── Gallery ── -->
      <div class="detail-gallery">
        <div class="gallery-main">
          <img
            v-if="activeImageUrl"
            :src="activeImageUrl"
            :alt="listing.title"
            class="main-img"
          />
          <div v-else class="gallery-placeholder">
            <Icon :name="typeIcon" class="placeholder-icon" />
          </div>
        </div>

        <div v-if="listing.images.length > 1" class="gallery-thumbs">
          <button
            v-for="(img, i) in listing.images"
            :key="i"
            class="thumb-btn"
            :class="{ active: activeIndex === i }"
            @click="activeIndex = i as number"
          >
            <img
              :src="img.url"
              :alt="`Zdjęcie ${(i as number) + 1}`"
              class="thumb-img"
            />
          </button>
        </div>
      </div>

      <!-- ── Info ── -->
      <div class="detail-info">
        <!-- Title row -->
        <div class="title-row">
          <h1 class="detail-title">{{ listing.title }}</h1>
          <button
            class="fav-btn"
            :class="{ active: isFav }"
            @click.stop.prevent="toggleFav"
          >
            <Icon :name="isFav ? 'mdi:heart' : 'mdi:heart-outline'" />
          </button>
        </div>

        <!-- City -->
        <div class="detail-city">
          <Icon name="mdi:map-marker-outline" />
          {{ listing.city }}
        </div>

        <!-- CTA -->
        <button class="cta-btn" disabled title="Wiadomości wkrótce">
          <Icon name="mdi:message-outline" />
          Napisz do właściciela
        </button>

        <!-- Description -->
        <p class="detail-description">{{ listing.description }}</p>

        <!-- Plant attrs -->
        <ListingAttrChips
          v-if="hasAttributes"
          :watering="listing.watering"
          :light="listing.light"
          :position="listing.position"
          :height="listing.height"
          :difficulty="listing.difficulty"
          :pet-friendly="listing.petFriendly"
          variant="full"
          class="plant-attrs"
        />

        <!-- Owner -->
        <div class="owner-card">
          <div class="owner-row">
            <div class="owner-avatar">{{ ownerInitial }}</div>
            <div class="owner-meta">
              <span class="owner-name">{{
                listing.user?.name ?? "Użytkownik"
              }}</span>
              <span class="owner-subtitle">Opiekun rośliny</span>
              <span class="owner-badge">
                <Icon name="mdi:leaf" class="badge-icon" />
                Zaufany użytkownik
                <Icon name="mdi:check-decagram" class="badge-check" />
              </span>
            </div>
          </div>
        </div>

        <!-- Safety tip -->
        <div class="safety-box">
          <div class="safety-header">
            <Icon name="mdi:shield-check-outline" class="safety-shield" />
            <p class="safety-title">Bezpieczna wymiana</p>
          </div>
          <p class="safety-text">
            Sprawdź stan rośliny i korzeni przed odbiorem. Unikaj roślin z
            oznakami chorób.
          </p>
          <NuxtLink to="/listings" class="safety-link"
            >Zasady społeczności →</NuxtLink
          >
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();
const id = route.params.id as string;

const { data, pending, error } = await useFetch<{
  listing: Record<string, any>;
}>(`/api/listings/${id}`);
const listing = computed(() => data.value?.listing);

// Gallery
const activeIndex = ref(0);
const activeImageUrl = computed(
  () => listing.value?.images?.[activeIndex.value]?.url ?? null,
);

// Favorites
const { isFavorite, toggle: favToggle, fetchFavorites } = useFavorites();
onMounted(fetchFavorites);
const isFav = computed(() => isFavorite(id));
function toggleFav() {
  favToggle(id);
}

// Owner
const ownerInitial = computed(() => {
  const name = listing.value?.user?.name ?? "";
  return name.charAt(0).toUpperCase() || "U";
});

const typeIcon = computed(
  () =>
    (
      ({
        PLANT: "mdi:flower",
        CUTTING: "mdi:sprout",
        LEAF: "mdi:leaf",
        SEEDS: "mdi:seed-outline",
      }) as Record<string, string>
    )[listing.value?.type ?? ""] ?? "mdi:flower",
);

const hasAttributes = computed(
  () =>
    listing.value?.watering ||
    listing.value?.light ||
    listing.value?.position ||
    listing.value?.height ||
    listing.value?.difficulty ||
    listing.value?.petFriendly !== null,
);

</script>

<style lang="scss" scoped>
.listing-detail {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

/* ── Breadcrumb ── */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.4rem;
  color: var(--text-muted);
  flex-wrap: wrap;

  a {
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.15s;

    &:hover {
      color: var(--green-dark);
    }
  }
}

.breadcrumb-sep {
  font-size: 1.4rem;
  opacity: 0.5;
}

.breadcrumb-current {
  color: var(--text-main);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 30rem;
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
  to {
    transform: rotate(360deg);
  }
}

/* ── Layout ── */
.detail-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4.8rem;
  align-items: start;
  background: #fff;
  border: 1px solid var(--border-soft);
  padding: 2.8rem;
  border-radius: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2.4rem;
    padding: 2rem;
  }
}

/* ── Gallery ── */
.detail-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 2.4rem;

  @media (max-width: 768px) {
    position: static;
  }
}

.gallery-main {
  border-radius: 2rem;
  overflow: hidden;
}

.main-img {
  width: 100%;
  object-fit: cover;
  height: 500px;
  display: block;
}

.gallery-placeholder {
  width: 100%;
  aspect-ratio: 4 / 2;
  background: linear-gradient(145deg, var(--green-soft), #b8e0bc);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 8rem;
  color: var(--green-dark);
  opacity: 0.3;
}

.gallery-thumbs {
  display: flex;
  gap: 0.8rem;
}

.thumb-btn {
  width: 10rem;
  height: 10rem;
  border: 2px solid transparent;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: none;
  transition: border-color 0.15s;

  &.active {
    border-color: var(--green-main);
  }

  &:hover:not(.active) {
    border-color: var(--border-soft);
  }
}

.thumb-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

/* ── Info column ── */
.detail-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.2rem;
}

.fav-btn {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 1.5px solid var(--border-soft);
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 2rem;
  color: var(--text-muted);
  flex-shrink: 0;
  transition:
    border-color 0.15s,
    color 0.15s,
    background 0.15s;

  &:hover {
    border-color: #fca5a5;
    color: #ef4444;
  }

  &.active {
    border-color: #fca5a5;
    background: #fef2f2;
    color: #ef4444;

    :deep(svg) {
      fill: currentColor;
    }
  }
}

.detail-title {
  font-family: var(--font-title);
  font-size: 3.6rem;
  font-weight: 700;
  color: var(--green-dark);
  margin: 0;
  line-height: 1.15;
  flex: 1;
}

.detail-city {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.5rem;
  color: var(--text-muted);
}

.detail-description {
  font-size: 1.5rem;
  color: var(--text-main);
  line-height: 1.75;
  margin: 0;
  white-space: pre-line;
}

/* ── Plant attrs ── */
.plant-attrs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.attr-chip {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.1rem 1.4rem;
  border-radius: 1.2rem;
  border: 1.5px solid var(--border-soft);
  background: var(--surface);

  &.attr-pet-yes {
    border-color: #86efac;
    background: #f0fdf4;

    .attr-icon {
      color: #16a34a;
    }
    .attr-value {
      color: #166534;
    }
  }

  &.attr-pet-no {
    border-color: #fca5a5;
    background: #fef2f2;

    .attr-icon {
      color: #ef4444;
    }
    .attr-value {
      color: #991b1b;
    }
  }
}

.attr-icon {
  font-size: 2rem;
  color: var(--green-main);
  flex-shrink: 0;
}

.attr-value {
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--text-main);
}

/* ── Owner ── */
.owner-card {
  padding: 1.6rem;
  border: 1px solid var(--border-soft);
  border-radius: 1.6rem;
  background: var(--surface);
}

.owner-row {
  display: flex;
  align-items: center;
  gap: 1.4rem;
}

.owner-avatar {
  width: 5.2rem;
  height: 5.2rem;
  border-radius: 50%;
  background: var(--green-soft);
  color: var(--green-dark);
  font-size: 2.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.owner-meta {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.owner-name {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-main);
}

.owner-subtitle {
  font-size: 1.3rem;
  color: var(--text-muted);
}

.owner-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.2rem;
  padding: 0.3rem 0.9rem 0.3rem 0.6rem;
  border-radius: 999px;
  background: var(--green-soft);
  color: var(--green-dark);
  font-size: 1.2rem;
  font-weight: 600;
  width: fit-content;
}

.badge-icon {
  font-size: 1.4rem;
  color: var(--green-main);
}

.badge-check {
  font-size: 1.3rem;
  color: var(--green-main);
}

/* ── CTA ── */
.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: fit-content;
  padding: 1.2rem 2.4rem;
  border-radius: 1.2rem;
  border: none;
  background: var(--green-dark);
  color: #fff;
  font-size: 1.6rem;
  font-family: var(--font-ui);
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s,
    opacity 0.15s;

  &:hover:not(:disabled) {
    background: #234a2b;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* ── Safety box ── */
.safety-box {
  padding: 1.8rem 2rem;
  border-radius: 1.6rem;
  border: 1px solid #e8e0d4;
  background: #faf6ef;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.safety-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.safety-shield {
  font-size: 2rem;
  color: #8c7a60;
  flex-shrink: 0;
}

.safety-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4a3f30;
  margin: 0;
}

.safety-text {
  font-size: 1.3rem;
  line-height: 1.6;
  color: #6b5c47;
  margin: 0;
}

.safety-link {
  font-size: 1.3rem;
  font-weight: 600;
  color: #6b5c47;
  text-decoration: none;
  width: fit-content;

  &:hover {
    text-decoration: underline;
  }
}
</style>
