<template>
  <main class="auth-page">
    <section class="auth-card">
      <h1>Rejestracja</h1>

      <form class="auth-form" @submit.prevent="onSubmit">
        <label>
          Imię
          <input v-model="form.name" type="text" minlength="2" required />
        </label>

        <label>
          Email
          <input v-model="form.email" type="email" required />
        </label>

        <label>
          Hasło
          <input
            v-model="form.password"
            type="password"
            minlength="8"
            required
          />
        </label>

        <button type="submit" :disabled="loading">
          {{ loading ? "Tworzenie konta..." : "Utwórz konto" }}
        </button>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
const form = reactive({
  name: "",
  email: "",
  password: "",
});

const loading = ref(false);
const errorMessage = ref<string | null>(null);

async function onSubmit() {
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
    errorMessage.value =
      err?.data?.message ||
      err?.data?.statusMessage ||
      "Rejestracja nie powiodła się";
  } finally {
    loading.value = false;
  }
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
</style>
