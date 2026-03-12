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
      <div v-for="n in 4" :key="n" class="skeleton-card" />
    </div>

    <div v-else-if="listings.length" class="recent-grid">
      <ListingCard
        v-for="item in listings"
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

    <p v-else class="empty">Brak ogłoszeń. Bądź pierwszy!</p>
  </section>
</template>

<script setup lang="ts">
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

const { data, pending } = await useFetch<{ items: ListingItem[] }>("/api/listings", {
  query: { pageSize: 4 },
});

const listings = computed(() => data.value?.items ?? []);
</script>

<style lang="scss" scoped>
.recent-listings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
  margin-top: 20px;
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
  text-decoration: none;
  transition: gap 0.15s;

  &:hover {
    gap: 0.8rem;
  }
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.6rem;
}

.skeleton-card {
  height: 36rem;
  border-radius: 2.4rem;
  background: linear-gradient(90deg, #e8f4ea 25%, #f0f8f1 50%, #e8f4ea 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty {
  font-size: 1.6rem;
  color: var(--text-muted);
  text-align: center;
  padding: 2rem;
}
</style>
