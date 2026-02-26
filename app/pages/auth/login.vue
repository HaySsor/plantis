<template>
  <AuthPageShell
    title="Witamy z ponownie"
    subtitle="Zaloguj się, zarządzać swoimi roślinami"
    @submit="onSubmit"
    :isLoginPage="true"
  >
    <template #auth-left-side>
      <div class="auth-image-side">
        <img
          :src="loginMobileSrc"
          alt="Auth image"
          class="side-image side-image-mobile"
        />
        <img
          :src="loginDesktopSrc"
          alt="Auth image"
          class="side-image side-image-desktop"
        />
      </div>
    </template>
    <template #default>
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
    </template>

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

const loginMobileSrc = "/login-mobile.png";
const loginDesktopSrc = "/login-transparent.png";

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
.auth-image-side {
  display: block;
  height: 200px;
  @media (min-width: 768px) {
    max-height: calc(100svh - 120px);
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 20px;
  }
}

.side-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: inherit;
}

.side-image-desktop {
  display: none;
}

@media (min-width: 768px) {
  .side-image-mobile {
    display: none;
  }

  .side-image-desktop {
    display: block;
  }
}

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
