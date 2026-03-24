<template>
  <AuthPageShell
    title="Weryfikacja e-mail"
    subtitle="Potwierdzamy Twój adres e-mail"
  >
    <template #auth-left-side>
      <div class="auth-image-side">
        <img src="/forgot-password.png" alt="Weryfikacja e-mail" class="side-image" />
      </div>
    </template>
    <template #default>
      <div v-if="pending" class="state-box">
        <Icon name="mdi:loading" class="spin" style="font-size: 4rem; color: var(--green-main);" />
        <p>Trwa weryfikacja...</p>
      </div>

      <div v-else-if="success" class="state-box success">
        <Icon name="mdi:check-circle-outline" class="state-icon success-icon" />
        <p>Adres e-mail został potwierdzony! Twoje konto ma teraz status <strong>Potwierdzony użytkownik</strong>.</p>
        <VButton :is-button="false" href="/account" type="primary">Przejdź do konta</VButton>
      </div>

      <div v-else class="state-box error">
        <Icon name="mdi:alert-circle-outline" class="state-icon error-icon" />
        <p>{{ errorMessage }}</p>
        <NuxtLink to="/account">Wróć do konta</NuxtLink>
      </div>
    </template>
  </AuthPageShell>
</template>

<script setup lang="ts">
const route = useRoute();
const token = route.query.token as string | undefined;

const pending = ref(true);
const success = ref(false);
const errorMessage = ref("");

const { fetchMe } = useAuth();

onMounted(async () => {
  if (!token) {
    errorMessage.value = "Brakujący token weryfikacyjny.";
    pending.value = false;
    return;
  }
  try {
    await $fetch(`/api/auth/verify-email?token=${token}`);
    await fetchMe();
    success.value = true;
  } catch (e: any) {
    errorMessage.value = e?.data?.statusMessage ?? "Link wygasł lub jest nieprawidłowy.";
  } finally {
    pending.value = false;
  }
});
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

.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.4rem;
  text-align: center;
  padding: 2rem 0;
  font-size: 1.5rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.state-icon { font-size: 4.8rem; }
.success-icon { color: var(--green-main); }
.error-icon { color: #e05a7a; }

.error { color: #b91c1c; }

a {
  color: var(--green-main);
  font-weight: 500;
  &:hover { text-decoration: underline; }
}
</style>
