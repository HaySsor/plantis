<template>
  <AuthPageShell
    title="Nowe hasło"
    subtitle="Ustaw nowe hasło do swojego konta"
    @submit="onSubmit"
  >
    <template #auth-left-side>
      <div class="auth-image-side">
        <img src="/forgot-password.png" alt="Resetowanie hasła" class="side-image" />
      </div>
    </template>
    <template #default>
      <div v-if="!token" class="error-box">
        <Icon name="mdi:alert-circle-outline" class="error-icon" />
        <p>Link jest nieprawidłowy lub wygasł.</p>
        <NuxtLink to="/auth/forgot-password">Wyślij nowy link</NuxtLink>
      </div>

      <div v-else-if="done" class="success-box">
        <Icon name="mdi:check-circle-outline" class="success-icon" />
        <p>Hasło zostało zmienione. Możesz się teraz zalogować.</p>
        <VButton :is-button="false" href="/auth/login" type="primary">Zaloguj się</VButton>
      </div>

      <template v-else>
        <p v-if="errorMessage" class="form-error-message">{{ errorMessage }}</p>

        <AuthInputBox
          id="password"
          label="Nowe hasło"
          type="password"
          icon="mdi:lock-outline"
          placeholder="Min. 8 znaków"
          v-model="password"
          required
        />

        <AuthInputBox
          id="password2"
          label="Powtórz hasło"
          type="password"
          icon="mdi:lock-check-outline"
          placeholder="Powtórz nowe hasło"
          v-model="password2"
          required
        />

        <VButton type="primary" :is-button="true" button-type="submit" :disabled="loading" style="width: 100%; margin-top: 0.8rem">
          {{ loading ? "Zapisywanie..." : "Ustaw nowe hasło" }}
        </VButton>
      </template>
    </template>
  </AuthPageShell>
</template>

<script setup lang="ts">
const route = useRoute();
const token = computed(() => route.query.token as string | undefined);

const password = ref("");
const password2 = ref("");
const loading = ref(false);
const done = ref(false);
const errorMessage = ref("");

async function onSubmit() {
  errorMessage.value = "";
  if (password.value.length < 8) {
    errorMessage.value = "Hasło musi mieć co najmniej 8 znaków.";
    return;
  }
  if (password.value !== password2.value) {
    errorMessage.value = "Hasła nie są identyczne.";
    return;
  }
  loading.value = true;
  try {
    await $fetch("/api/auth/reset-password", {
      method: "POST",
      body: { token: token.value, password: password.value },
    });
    done.value = true;
  } catch (e: any) {
    errorMessage.value = e?.data?.statusMessage ?? "Wystąpił błąd. Spróbuj ponownie.";
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.auth-image-side {
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}

.side-image {
  width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

.success-box,
.error-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  text-align: center;
  padding: 2rem 0;
  font-size: 1.5rem;
  line-height: 1.6;
}

.success-box { color: var(--text-muted); }
.error-box { color: #b91c1c; }

.success-icon { font-size: 4.8rem; color: var(--green-main); }
.error-icon   { font-size: 4.8rem; color: #e05a7a; }

.form-error-message {
  color: #b91c1c;
  font-size: 1.4rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.8rem;
  padding: 0.8rem 1.2rem;
}
</style>
