<template>
  <AuthPageShell
    title="Utwórz konto"
    subtitle="Załóż konto i zacznij oddawać rośliny"
    image-alt="Register image"
    @submit="onSubmit"
  >
    <p v-if="errorMessage" class="form-error-message">{{ errorMessage }}</p>

    <AuthInputBox
      id="name"
      label="Imię"
      type="text"
      icon="mdi:account-outline"
      placeholder="Wprowadź swoje imię"
      autocomplete="name"
      v-model="form.name"
      :disabled="loading"
      :required="true"
    />

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
      autocomplete="new-password"
      v-model="form.password"
      :disabled="loading"
      :required="true"
    />

    <VButton
      :loading="loading"
      type="primary"
      :isButton="true"
      button-type="submit"
      :disabled="loading"
      custom-class="form-button"
    >
      Utwórz konto
    </VButton>

    <template #footer>
      <div class="auth-reg-box">
        <span>Masz już konto?</span>
        <NuxtLink to="/auth/login" class="input-link">Zaloguj się</NuxtLink>
      </div>
    </template>
  </AuthPageShell>
</template>

<script setup lang="ts">
const form = reactive({
  name: "",
  email: "",
  password: "",
});

const loading = ref(false);
const errorMessage = ref<string | null>(null);

function getRegisterErrorMessage(err: any) {
  const raw = err?.data?.message || err?.data?.statusMessage || "";

  if (raw === "Name, email and password are required") {
    return "Uzupełnij imię, e-mail i hasło.";
  }

  if (raw === "Name must be at least 2 characters") {
    return "Imię musi mieć co najmniej 2 znaki.";
  }

  if (raw === "Password must be at least 8 characters") {
    return "Hasło musi mieć co najmniej 8 znaków.";
  }

  if (raw === "User already exists") {
    return "Konto z tym adresem e-mail już istnieje.";
  }

  return "Rejestracja nie powiodła się. Spróbuj ponownie.";
}

async function onSubmit() {
  if (loading.value) {
    return;
  }

  errorMessage.value = null;
  loading.value = true;

  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        name: form.name,
        email: form.email,
        password: form.password,
      },
    });

    await navigateTo("/account");
  } catch (err: any) {
    errorMessage.value = getRegisterErrorMessage(err);
  } finally {
    loading.value = false;
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
