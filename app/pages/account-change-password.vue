<template>
  <main class="change-pw-page">
    <nav class="breadcrumb">
      <NuxtLink to="/">Główna</NuxtLink>
      <Icon name="mdi:chevron-right" class="breadcrumb-sep" />
      <NuxtLink to="/account">Panel</NuxtLink>
      <Icon name="mdi:chevron-right" class="breadcrumb-sep" />
      <span class="breadcrumb-current">Zmiana hasła</span>
    </nav>

    <div class="change-pw-card">
      <div class="card-header">
        <span class="card-icon">
          <Icon name="mdi:lock-outline" />
        </span>
        <div>
          <h1 class="card-title">Zmień hasło</h1>
          <p class="card-subtitle">Wprowadź obecne hasło i ustaw nowe</p>
        </div>
      </div>

      <form class="card-form" @submit.prevent="onSubmit">
        <div v-if="done" class="result-box result-box--ok">
          <Icon name="mdi:check-circle-outline" />
          Hasło zostało zmienione.
        </div>

        <template v-else>
          <div v-if="errorMsg" class="result-box result-box--error">
            <Icon name="mdi:alert-circle-outline" />
            {{ errorMsg }}
          </div>

          <AuthInputBox
            id="current-password"
            label="Obecne hasło"
            type="password"
            icon="mdi:lock-outline"
            placeholder="Twoje aktualne hasło"
            v-model="currentPassword"
            required
          />

          <AuthInputBox
            id="new-password"
            label="Nowe hasło"
            type="password"
            icon="mdi:lock-reset"
            placeholder="Min. 8 znaków"
            v-model="newPassword"
            required
          />

          <AuthInputBox
            id="confirm-password"
            label="Powtórz nowe hasło"
            type="password"
            icon="mdi:lock-check-outline"
            placeholder="Powtórz nowe hasło"
            v-model="confirmPassword"
            required
          />

          <div class="form-actions">
            <NuxtLink to="/account" class="cancel-link">Anuluj</NuxtLink>
            <VButton class="btn" " type="primary" :is-button="true" button-type="submit" :disabled="loading">
              {{ loading ? 'Zapisywanie...' : 'Zmień hasło' }}
            </VButton>
          </div>
        </template>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const done = ref(false);
const errorMsg = ref("");

async function onSubmit() {
  errorMsg.value = "";

  if (newPassword.value.length < 8) {
    errorMsg.value = "Nowe hasło musi mieć co najmniej 8 znaków.";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = "Nowe hasła nie są identyczne.";
    return;
  }

  loading.value = true;
  try {
    await $fetch("/api/auth/change-password", {
      method: "POST",
      body: { currentPassword: currentPassword.value, newPassword: newPassword.value },
    });
    done.value = true;
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage ?? "Wystąpił błąd. Spróbuj ponownie.";
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.change-pw-page {
  max-width: 52rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.4rem;
  color: var(--text-muted);

  a {
    color: var(--text-muted);
    text-decoration: none;
    &:hover { color: var(--green-dark); }
  }
}

.breadcrumb-sep { font-size: 1.4rem; opacity: 0.5; }
.breadcrumb-current { color: var(--text-main); font-weight: 600; }

.change-pw-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 2rem;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  padding: 2rem 2.4rem;
  border-bottom: 1px solid var(--border-soft);
  background: #f4f5f4;
}

.card-icon {
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 1.2rem;
  background: #6d7a9f;
  color: #fff;
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-title {
  font-family: var(--font-title);
  font-size: 2rem;
  font-weight: 700;
  color: var(--green-dark);
  margin: 0 0 0.2rem;
}

.card-subtitle {
  font-size: 1.3rem;
  color: var(--text-muted);
  margin: 0;
}

.card-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 2.4rem;
}

.result-box {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  font-weight: 500;
  padding: 1rem 1.4rem;
  border-radius: 1rem;

  &--ok    { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
  &--error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.2rem;
  margin-top: 0.4rem;
}

.cancel-link {
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  &:hover { color: var(--text-main); }
}

.btn{
  padding: 8px 16px;
  font-size: 14px;
}
</style>
