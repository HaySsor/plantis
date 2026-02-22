<template>
  <main class="account-page">
    <section class="account-card">
      <h1>Moje konto</h1>

      <div v-if="loading" class="state-text">Ładowanie konta...</div>

      <div v-else-if="user" class="account-content">
        <p>Imię:</p>
        <strong>{{ user.name || "Brak imienia" }}</strong>

        <p>E-mail:</p>
        <strong>{{ user.email }}</strong>

        <button type="button" @click="onLogout" :disabled="loading">
          {{ loading ? "Wylogowywanie..." : "Wyloguj się" }}
        </button>
      </div>

      <div v-else class="account-content">
        <p>Nie jesteś zalogowany.</p>
        <NuxtLink to="/auth/login">Przejdź do logowania</NuxtLink>
      </div>
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
  padding: 2.4rem;
  border-radius: 1.6rem;
  border: 1px solid var(--border-soft);
  background: #ffffff;
}

h1 {
  margin: 0 0 1.6rem;
  font-size: 2.8rem;
  color: var(--green-dark);
}

.state-text {
  font-size: 1.6rem;
  color: var(--text-muted);
}

.account-content {
  display: grid;
  gap: 0.8rem;
  font-size: 1.6rem;
  color: var(--text-main);
}

.account-content p {
  margin: 0;
  color: var(--text-muted);
}

.account-content strong {
  word-break: break-all;
}

button {
  margin-top: 1rem;
  border: 0;
  border-radius: 1rem;
  padding: 1rem 1.2rem;
  background: var(--green-main);
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

a {
  color: var(--green-dark);
  font-weight: 600;
}
</style>
