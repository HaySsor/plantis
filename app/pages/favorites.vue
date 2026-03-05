<template>
  <main class="favorites-page">
    <div class="favorites-header">
      <h1>Ulubione ogłoszenia</h1>
    </div>

    <div v-if="pending" class="state-box">
      <Icon name="mdi:loading" class="spin" />
      Ładowanie...
    </div>

    <div v-else-if="listings.length === 0" class="state-box">
      <Icon name="mdi:heart-outline" class="empty-icon" />
      <p>Nie masz jeszcze żadnych ulubionych ogłoszeń.</p>
      <NuxtLink to="/listings" class="browse-link">Przeglądaj ogłoszenia</NuxtLink>
    </div>

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
const { user } = useAuth();
const router = useRouter();

if (!user.value) {
  await router.push("/auth/login");
}

const { data, pending } = await useFetch("/api/favorites/listings");
const listings = computed(() => data.value?.items ?? []);
</script>

<style lang="scss" scoped>
.favorites-page {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.favorites-header {
  h1 {
    font-size: 3.2rem;
    color: var(--green-dark);
    margin: 0;
  }
}

.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  padding: 6rem 2rem;
  font-size: 1.6rem;
  color: var(--text-muted);
  text-align: center;
}

.empty-icon {
  font-size: 5.6rem;
  color: #e05a7a;
  opacity: 0.5;
}

.spin {
  font-size: 3.2rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.browse-link {
  display: inline-flex;
  padding: 0.9rem 2rem;
  border-radius: 999px;
  background: var(--green-soft);
  color: var(--green-dark);
  font-size: 1.4rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;

  &:hover {
    background: var(--green-main);
    color: #fff;
  }
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
  gap: 1.6rem;
}
</style>
