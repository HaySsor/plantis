<template>
  <div class="preview-page">
    <!-- Back -->
    <NuxtLink to="/zaplecze/listings" class="back-link">
      <Icon name="mdi:arrow-left" />
      Ogłoszenia oczekujące
    </NuxtLink>

    <div v-if="pending" class="state-info">Ładowanie...</div>
    <div v-else-if="!listing" class="state-info">Nie znaleziono ogłoszenia.</div>

    <template v-else>
      <!-- Header row -->
      <div class="preview-header">
        <div class="header-left">
          <span class="status-badge" :class="`status--${listing.status.toLowerCase()}`">
            {{ statusLabel(listing.status) }}
          </span>
          <h1>{{ listing.title }}</h1>
          <div class="meta-row">
            <span class="meta-item">
              <Icon name="mdi:map-marker-outline" />
              {{ listing.city }}
            </span>
            <span class="meta-item">
              <Icon name="mdi:account-outline" />
              {{ listing.user.name ?? listing.user.email }}
            </span>
            <span class="meta-item">
              <Icon name="mdi:calendar-outline" />
              {{ formatDate(listing.createdAt) }}
            </span>
          </div>
        </div>

        <div v-if="listing.status === 'PENDING'" class="header-actions">
          <button
            class="action-btn action-btn--approve"
            :disabled="processing"
            @click="decide('ACTIVE')"
          >
            <Icon name="mdi:check" />
            Zatwierdź
          </button>
          <button
            class="action-btn action-btn--reject"
            :disabled="processing"
            @click="decide('REJECTED')"
          >
            <Icon name="mdi:close" />
            Odrzuć
          </button>
        </div>
      </div>

      <!-- Images -->
      <div v-if="listing.images.length" class="image-strip">
        <img
          v-for="(img, i) in listing.images"
          :key="i"
          :src="img.url"
          :alt="`Zdjęcie ${i + 1}`"
          class="preview-img"
        />
      </div>

      <!-- Details grid -->
      <div class="details-grid">
        <!-- Description -->
        <div class="detail-card span-full">
          <h3 class="detail-label">Opis</h3>
          <p class="detail-text">{{ listing.description }}</p>
        </div>

        <!-- Plant attributes -->
        <div class="detail-card">
          <h3 class="detail-label">Informacje o roślinie</h3>
          <ListingAttrChips
            :watering="listing.watering"
            :light="listing.light"
            :position="listing.position"
            :height="listing.height"
            :difficulty="listing.difficulty"
            :pet-friendly="listing.petFriendly"
            variant="full"
          />
        </div>

        <!-- Logistics -->
        <div class="detail-card">
          <h3 class="detail-label">Szczegóły</h3>
          <ul class="detail-list">
            <li>
              <Icon name="mdi:tag-outline" />
              <span>Typ: <strong>{{ typeLabel(listing.type) }}</strong></span>
            </li>
            <li>
              <Icon name="mdi:truck-outline" />
              <span>Dostawa: <strong>{{ deliveryLabel(listing.deliveryMode) }}</strong></span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ["admin"], layout: "admin" });

const route = useRoute();
const id = route.params.id as string;

const { data, pending } = await useFetch(`/api/admin/listings/${id}` as string);
const listing = computed(() => data.value?.listing ?? null);

const processing = ref(false);

async function decide(status: "ACTIVE" | "REJECTED") {
  processing.value = true;
  try {
    await $fetch(`/api/admin/listings/${id}/status` as string, {
      method: "PATCH",
      body: { status },
    });
    await refreshNuxtData("admin-pending");
    await navigateTo("/zaplecze/listings");
  } finally {
    processing.value = false;
  }
}

function statusLabel(s: string) {
  return { PENDING: "Oczekujące", ACTIVE: "Aktywne", REJECTED: "Odrzucone" }[s] ?? s;
}

function typeLabel(t: string) {
  return { PLANT: "Roślina", CUTTING: "Sadzonka", LEAF: "Liść", SEEDS: "Nasiona" }[t] ?? t;
}

function deliveryLabel(d: string) {
  return { PICKUP: "Odbiór osobisty", SHIPPING: "Wysyłka", BOTH: "Odbiór / Wysyłka" }[d] ?? d;
}

function formatDate(d: string) {
  const date = new Date(d);
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}
</script>

<style lang="scss" scoped>
.preview-page {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.4rem;
  font-weight: 500;
  color: #6b8f6b;
  text-decoration: none;

  &:hover {
    color: #1a2e20;
  }
}

.state-info {
  font-size: 1.5rem;
  color: var(--text-muted);
}

/* ── Header ── */
.preview-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.status-badge {
  display: inline-block;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 0.3rem 1rem;
  border-radius: 999px;

  &.status--pending  { background: #fef3c7; color: #92400e; }
  &.status--active   { background: #d9f0d7; color: #1a5c2a; }
  &.status--rejected { background: #fee2e2; color: #991b1b; }
}

h1 {
  font-family: var(--font-title);
  font-size: 2.8rem;
  color: #1a2e20;
  margin: 0;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.3rem;
  color: var(--text-muted);
}

.header-actions {
  display: flex;
  gap: 0.8rem;
  flex-shrink: 0;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 2rem;
  border-radius: 999px;
  font-size: 1.4rem;
  font-family: var(--font-ui);
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s, background 0.15s;

  &:disabled { opacity: 0.5; cursor: not-allowed; }

  &--approve {
    background: var(--green-main);
    color: #fff;
    &:hover:not(:disabled) { background: var(--green-dark); }
  }

  &--reject {
    background: #fee2e2;
    color: #991b1b;
    &:hover:not(:disabled) { background: #fecaca; }
  }
}

/* ── Images ── */
.image-strip {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.preview-img {
  width: 28rem;
  height: 22rem;
  object-fit: cover;
  border-radius: 1.4rem;
  border: 1px solid var(--border-soft);
}

/* ── Details grid ── */
.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
}

.detail-card {
  background: #fff;
  border: 1px solid var(--border-soft);
  border-radius: 1.6rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  &.span-full { grid-column: 1 / -1; }
}

.detail-label {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.detail-text {
  font-size: 1.5rem;
  color: var(--text-main);
  line-height: 1.7;
  margin: 0;
  white-space: pre-wrap;
}

.detail-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  li {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.4rem;
    color: var(--text-main);
  }
}
</style>
