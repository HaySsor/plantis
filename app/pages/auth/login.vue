<template>
  <AuthPageShell
    title="Witamy z ponownie"
    subtitle="Zaloguj się, zarządzać swoimi roślinami"
    image-alt="Login image"
    @submit="onSubmit"
  >
    <p v-if="errorMessage" class="form-error-message">{{ errorMessage }}</p>

    <AuthInputBox
      id="email"
      label="Email"
      type="email"
      icon="mdi:email"
      placeholder="Wprowadź swój email"
      autocomplete="email"
      v-model="form.email"
      :disabled="loading"
      :required="true"
    />
    <AuthInputBox
      id="password"
      label="Hasło"
      type="password"
      icon="mdi:lock"
      placeholder="Wprowadź swoje hasło"
      autocomplete="current-password"
      v-model="form.password"
      :disabled="loading"
      :required="true"
    >
      <template #top>
        <NuxtLink to="/auth/forgot-password" class="input-link"
          >Zapomniałeś hasła?</NuxtLink
        >
      </template>
    </AuthInputBox>

    <VButton
      :loading="loading"
      type="primary"
      :isButton="true"
      button-type="submit"
      :disabled="loading"
      custom-class="form-button"
    >
      Zaloguj się
    </VButton>

    <template #footer>
      <div class="auth-reg-box">
        <span>Nie masz konta?</span>
        <NuxtLink to="/auth/register" class="input-link"
          >Zarejestruj się</NuxtLink
        >
      </div>
    </template>
  </AuthPageShell>
</template>

<script setup lang="ts">
const form = reactive({
  email: "",
  password: "",
});

const errorMessage = ref<string | null>(null);

const { login, loading } = useAuth();

function getLoginErrorMessage(err: any) {
  const raw = err?.data?.message || err?.data?.statusMessage || "";

  if (raw === "Email and password are required") {
    return "Podaj adres e-mail i hasło.";
  }

  if (raw === "Invalid credentials") {
    return "Niepoprawny e-mail lub hasło.";
  }

  return "Logowanie nie powiodło się. Spróbuj ponownie.";
}

async function onSubmit() {
  if (loading.value) {
    return;
  }

  errorMessage.value = null;

  try {
    await login(form.email, form.password);
    await navigateTo("/account");
  } catch (err: any) {
    errorMessage.value = getLoginErrorMessage(err);
  }
}
</script>

<style scoped lang="scss">
.form-error-message {
  color: lightcoral;
  font-size: 13px;
  margin-bottom: -4px;
}

.form-button {
  @media (min-width: 768px) {
    padding: 15px 40px;
  }
}
</style>
