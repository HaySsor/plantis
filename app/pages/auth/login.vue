<template>
  <main class="auth-page">
    <section class="auth-card">
      <h1>Logowanie</h1>

      <form v-if="!user" class="auth-form" @submit.prevent="onSubmit">
        <label>
          Email
          <input v-model="form.email" type="email" required />
        </label>

        <label>
          Hasło
          <input v-model="form.password" type="password" required />
        </label>

        <button type="submit" :disabled="loading">
          {{ loading ? "Logowanie..." : "Zaloguj się" }}
        </button>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p class="register-hint">
          Nie masz konta?
          <NuxtLink to="/auth/register">Zarejestruj się</NuxtLink>
        </p>
      </form>

      <div v-else class="logged-view">
        <p>Zalogowany użytkownik:</p>
        <strong>{{ user.email }}</strong>
        <button type="button" @click="onLogout" :disabled="loading">
          {{ loading ? "Wylogowywanie..." : "Wyloguj się" }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const form = reactive({
  email: "",
  password: "",
});

const errorMessage = ref<string | null>(null);

const { user, login, logout, loading } = useAuth();

async function onSubmit() {
  errorMessage.value = null;

  try {
    await login(form.email, form.password);
    await navigateTo("/account");
  } catch (err: any) {
    errorMessage.value =
      err?.data?.message ||
      err?.data?.statusMessage ||
      "Logowanie nie powiodło się";
  }
}

async function onLogout() {
  await logout();
}
</script>

<style lang="scss" scoped>
.auth-page {
  display: grid;
  place-items: center;
}

.auth-card {
  width: 100%;
  max-width: 440px;
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

.auth-form {
  display: grid;
  gap: 1.2rem;
}

label {
  display: grid;
  gap: 0.6rem;
  font-size: 1.4rem;
  color: var(--text-muted);
}

input {
  border: 1px solid var(--border-soft);
  border-radius: 1rem;
  padding: 1rem 1.2rem;
  font-size: 1.6rem;
  color: var(--text-main);
}

button {
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

.error {
  margin: 0;
  color: #b33a3a;
  font-size: 1.4rem;
}

.register-hint {
  margin: 0;
  font-size: 1.4rem;
  color: var(--text-muted);
}

.register-hint a {
  color: var(--green-dark);
  font-weight: 600;
}

.logged-view {
  display: grid;
  gap: 1rem;
  font-size: 1.6rem;
  color: var(--text-main);
}

.logged-view p {
  margin: 0;
  color: var(--text-muted);
}

.logged-view strong {
  word-break: break-all;
}
</style>
