<template>
  <AuthPageShell
    title="Utwórz konto"
    subtitle="Załóż konto i zacznij oddawać rośliny"
    @submit="onSubmit"
  >
    <template #auth-left-side>
      <aside class="register-left-side">
        <h2 class="register-left-title">
          Dołącz do zielonej
          <span>społeczności</span>
        </h2>

        <ul class="benefit-list">
          <li class="benefit-item">
            <span class="benefit-check">
              <Icon name="mdi:check" />
            </span>
            <div>
              <h3>Drugie życie dla roślin</h3>
              <p>
                Zamiast wyrzucać, znajdź swoim roślinom nowy, kochający dom.
              </p>
            </div>
          </li>

          <li class="benefit-item">
            <span class="benefit-check">
              <Icon name="mdi:check" />
            </span>
            <div>
              <h3>Wymiana bezkosztowa</h3>
              <p>
                Zdobądź wymarzone gatunki bez wydawania pieniędzy, w duchu zero
                waste.
              </p>
            </div>
          </li>

          <li class="benefit-item">
            <span class="benefit-check">
              <Icon name="mdi:check" />
            </span>
            <div>
              <h3>Lokalna społeczność</h3>
              <p>Poznaj pasjonatów roślin w Twojej najbliższej okolicy.</p>
            </div>
          </li>
        </ul>

        <div class="register-opinion">
          <div class="opinion-avatars">
            <span class="avatar avatar-one"><Icon name="mdi:account" /></span>
            <span class="avatar avatar-two"><Icon name="mdi:account" /></span>
            <span class="avatar avatar-three"><Icon name="mdi:account" /></span>
          </div>
          <p>
            "Najlepsze miejsce dla każdego rośliniomaniaka!" - Anna z Warszawy
          </p>
        </div>
      </aside>
    </template>

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
.register-left-side {
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 24px;
  padding: 20px;
  background-color: #eff5f1;
  border: 1px solid #e1ebe3;
  height: max-content;

  @media (min-width: 768px) {
    min-height: 605px;
  }

  @media (min-width: 1200px) {
    padding: 44px 34px;
    gap: 38px;
  }
}

.brand-highlight {
  color: #2ecb63;
}

.register-left-title {
  font-size: 2.2rem;
  line-height: 1.03;
  letter-spacing: -0.03em;
  color: #0f2218;
  font-weight: 800;
  font-family: var(--font-title);

  span {
    display: block;
    color: var(--green-main);
  }

  @media (min-width: 768px) {
    font-size: 4rem;
  }
}

.benefit-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (min-width: 768px) {
    gap: 26px;
  }
}

.benefit-item {
  display: flex;
  gap: 18px;

  h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #162a1d;
    margin-bottom: 6px;
    font-family: var(--font-title);
  }

  p {
    font-size: 1.4rem;
    line-height: 1.35;
    color: #738278;
  }
}

.benefit-check {
  width: 24px;
  min-width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f8faf9;
  border: 1px solid #e5ece7;
  color: #24c55f;
  display: grid;
  place-items: center;
  font-size: 1.6rem;
  margin-top: 2px;
}

.register-opinion {
  border-top: 1px solid #dbe6de;
  padding-top: 26px;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: auto;
  p {
    font-size: 1.4rem;
    line-height: 1.3;
    color: #7b807f;
    font-style: italic;
    font-weight: 700;
  }
}

.opinion-avatars {
  display: flex;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 2px solid #eff5f1;
  color: #5d6b63;
  font-size: 22px;
}

.avatar-two,
.avatar-three {
  margin-left: -10px;
}

.avatar-one {
  background: #ebddcb;
}

.avatar-two {
  background: #d5e7ca;
}

.avatar-three {
  background: #ecd8b9;
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
