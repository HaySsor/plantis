<template>
  <main class="account-page">
    <div v-if="loading" class="state-text">Ładowanie konta...</div>

    <template v-else-if="user">
      <section class="account-card">
        <div class="account-avatar">
          <Icon name="mdi:account-circle" />
        </div>

        <div class="account-info">
          <p class="account-name">{{ user.name }}</p>
          <p class="account-email">{{ user.email }}</p>
        </div>

        <div class="account-actions">
          <VButton
            :is-button="false"
            type="secondary"
            href="/listings/add"
          >
            <Icon name="mdi:plus" />
            Dodaj ogłoszenie
          </VButton>

          <VButton
            :is-button="true"
            type="light"
            :loading="loading"
            @click="onLogout"
          >
            Wyloguj się
          </VButton>
        </div>
      </section>
    </template>

    <section v-else class="account-card">
      <p class="state-text">Nie jesteś zalogowany.</p>
      <VButton :is-button="false" type="primary" href="/auth/login">
        Przejdź do logowania
      </VButton>
    </section>
  </main>
</template>

<script setup lang="ts">
const { user, loading, fetchMe, logout } = useAuth();

onMounted(() => {
  fetchMe().catch(() => {});
});

async function onLogout() {
  await logout();
  await navigateTo("/auth/login");
}
</script>

<style lang="scss" scoped>
.account-page {
  display: grid;
  place-items: center;
  padding: 2rem;
}

.account-card {
  width: 100%;
  max-width: 480px;
  padding: 3.2rem 2.4rem;
  border-radius: 2rem;
  border: 1px solid var(--border-soft);
  background: var(--surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.account-avatar {
  font-size: 7.2rem;
  color: var(--green-main);
  line-height: 1;
}

.account-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.account-name {
  font-size: 2.2rem;
  font-family: var(--font-title);
  font-weight: 700;
  color: var(--green-dark);
}

.account-email {
  font-size: 1.5rem;
  color: var(--text-muted);
}

.account-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.state-text {
  font-size: 1.6rem;
  color: var(--text-muted);
}
</style>
