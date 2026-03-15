<template>
  <div class="admin-login-page">
    <div class="admin-login-card">
      <div class="login-brand">
        <Icon name="mdi:leaf" class="brand-icon" />
        <span>Plantis <em>admin</em></span>
      </div>

      <h1>Logowanie</h1>

      <form @submit.prevent="onSubmit">
        <div class="field">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="admin@plantis.pl"
            autocomplete="username"
            required
          />
        </div>

        <div class="field">
          <label for="password">Hasło</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </div>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          <Icon v-if="loading" name="mdi:loading" class="spin" />
          Zaloguj się
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const { login, logout, user, loading } = useAuth();

const form = reactive({ email: "", password: "" });
const errorMessage = ref<string | null>(null);

async function onSubmit() {
  errorMessage.value = null;
  try {
    await login(form.email, form.password);

    if (user.value?.role !== "ADMIN") {
      await logout();
      errorMessage.value = "Brak dostępu do panelu administratora.";
      return;
    }

    await navigateTo("/zaplecze");
  } catch {
    errorMessage.value = "Niepoprawny e-mail lub hasło.";
  }
}
</script>

<style lang="scss" scoped>
.admin-login-page {
  min-height: 100dvh;
  background: #1a2e20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.admin-login-card {
  background: #fff;
  border-radius: 2rem;
  padding: 3.6rem 3.2rem;
  width: 100%;
  max-width: 42rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.8rem;
  font-weight: 700;
  font-family: var(--font-title);
  color: #1a2e20;

  em {
    font-style: normal;
    color: var(--green-main);
    font-weight: 400;
  }
}

.brand-icon {
  font-size: 2.4rem;
  color: var(--green-main);
}

h1 {
  font-size: 2.4rem;
  font-family: var(--font-title);
  color: var(--text-main);
  margin: -1rem 0 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  label {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  input {
    padding: 1.2rem 1.4rem;
    border-radius: 1rem;
    border: 1.5px solid var(--border-soft);
    font-size: 1.5rem;
    font-family: var(--font-ui);
    color: var(--text-main);
    background: #fff;
    transition: border-color 0.15s;

    &:focus {
      outline: none;
      border-color: var(--green-main);
    }
  }
}

.error-msg {
  font-size: 1.3rem;
  color: #dc2626;
  margin: 0;
}

.submit-btn {
  padding: 1.3rem;
  border-radius: 999px;
  background: #1a2e20;
  color: #fff;
  font-size: 1.5rem;
  font-family: var(--font-ui);
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 0.4rem;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #2e5235;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
