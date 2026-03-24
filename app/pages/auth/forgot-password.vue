<template>
  <AuthPageShell
    title="Zapomniałeś hasła?"
    subtitle="Wyślemy Ci link do resetowania hasła"
    @submit="onSubmit"
  >
    <template #auth-left-side>
      <div class="auth-image-side">
        <img src="/forgot-password.png" alt="Zapomniałem hasła" class="side-image" />
      </div>
    </template>
    <template #default>
      <div v-if="sent" class="success-box">
        <Icon name="mdi:email-check-outline" class="success-icon" />
        <p>Jeśli podany adres istnieje w naszej bazie, wysłaliśmy link resetujący. Sprawdź skrzynkę.</p>
      </div>

      <template v-else>
        <p v-if="errorMessage" class="form-error-message">{{ errorMessage }}</p>

        <AuthInputBox
          id="email"
          label="Email"
          type="email"
          icon="mdi:email"
          placeholder="Wprowadź swój email"
          v-model="email"
          required
        />

        <VButton type="primary" :is-button="true" button-type="submit" :disabled="loading" style="width: 100%; margin-top: 0.8rem">
          {{ loading ? "Wysyłanie..." : "Wyślij link" }}
        </VButton>

        <p class="back-link">
          <NuxtLink to="/auth/login">← Wróć do logowania</NuxtLink>
        </p>
      </template>
    </template>
  </AuthPageShell>
</template>

<script setup lang="ts">
const email = ref("");
const loading = ref(false);
const sent = ref(false);
const errorMessage = ref("");

async function onSubmit() {
  if (!email.value) return;
  loading.value = true;
  errorMessage.value = "";
  try {
    await $fetch("/api/auth/forgot-password", {
      method: "POST",
      body: { email: email.value },
    });
    sent.value = true;
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

.success-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  text-align: center;
  padding: 2rem 0;
  color: var(--text-muted);
  font-size: 1.5rem;
  line-height: 1.6;
}

.success-icon {
  font-size: 4.8rem;
  color: var(--green-main);
}

.form-error-message {
  color: #b91c1c;
  font-size: 1.4rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.8rem;
  padding: 0.8rem 1.2rem;
}

.back-link {
  text-align: center;
  font-size: 1.4rem;
  margin-top: 0.4rem;

  a {
    color: var(--green-main);
    font-weight: 500;
    &:hover { text-decoration: underline; }
  }
}
</style>
