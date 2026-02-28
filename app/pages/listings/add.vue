<template>
  <main class="add-page">
    <!-- Lewa kolumna — formularz -->
    <div class="add-shell">
      <NuxtLink to="/account" class="back-link">
        <Icon name="mdi:arrow-left" />
        Moje konto
      </NuxtLink>

      <h1>Dodaj ogłoszenie</h1>
      <p class="subtitle">Opisz roślinę, którą chcesz oddać lub sprzedać</p>

      <form class="add-form" @submit.prevent="onSubmit">
        <!-- Nazwa -->
        <AuthInputBox
          id="title"
          label="Nazwa rośliny"
          placeholder="np. Monstera Deliciosa"
          icon="mdi:flower"
          v-model="form.title"
          :error-message="errors.title"
          required
        />

        <!-- Typ materiału -->
        <div class="field-group">
          <label class="field-label">Co oferujesz?</label>
          <p v-if="errors.type" class="field-error">{{ errors.type }}</p>
          <div class="chip-group">
            <button
              v-for="opt in typeOptions"
              :key="opt.value"
              type="button"
              class="chip"
              :class="{ active: form.type === opt.value }"
              @click="form.type = opt.value"
            >
              <Icon :name="opt.icon" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Opis -->
        <div class="field-group span-full">
          <label class="field-label" for="description">Opis</label>
          <p v-if="errors.description" class="field-error">
            {{ errors.description }}
          </p>
          <textarea
            id="description"
            v-model="form.description"
            placeholder="Opisz stan rośliny, wiek, wymagania pielęgnacyjne, powód oddawania..."
            rows="5"
          />
        </div>

        <!-- Miasto -->
        <AuthInputBox
          id="city"
          label="Miasto odbioru"
          placeholder="np. Warszawa"
          icon="mdi:map-marker"
          v-model="form.city"
          :error-message="errors.city"
          required
        />

        <!-- Sposób przekazania -->
        <div class="field-group">
          <label class="field-label">Sposób przekazania</label>
          <p v-if="errors.deliveryMode" class="field-error">
            {{ errors.deliveryMode }}
          </p>
          <div class="chip-group">
            <button
              v-for="opt in deliveryOptions"
              :key="opt.value"
              type="button"
              class="chip"
              :class="{ active: form.deliveryMode === opt.value }"
              @click="form.deliveryMode = opt.value"
            >
              <Icon :name="opt.icon" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <p v-if="serverError" class="server-error span-full">
          {{ serverError }}
        </p>

        <VButton
          :is-button="true"
          button-type="submit"
          type="secondary"
          :loading="submitting"
          custom-class="span-full"
        >
          Opublikuj ogłoszenie
        </VButton>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
const { user, fetchMe } = useAuth();

onMounted(async () => {
  await fetchMe().catch(() => {});
  if (!user.value) {
    await navigateTo("/auth/login");
  }
});

const form = reactive({
  title: "",
  description: "",
  city: "",
  type: "",
  deliveryMode: "",
});

const errors = reactive({
  title: null as string | null,
  description: null as string | null,
  city: null as string | null,
  type: null as string | null,
  deliveryMode: null as string | null,
});

const submitting = ref(false);
const serverError = ref<string | null>(null);

const typeOptions = [
  { value: "PLANT", label: "Roślina", icon: "mdi:flower" },
  { value: "CUTTING", label: "Sadzonka", icon: "mdi:sprout" },
  { value: "LEAF", label: "Liść", icon: "mdi:leaf" },
  { value: "SEEDS", label: "Nasiona", icon: "mdi:seed" },
];

const deliveryOptions = [
  { value: "PICKUP", label: "Odbiór osobisty", icon: "mdi:handshake" },
  { value: "SHIPPING", label: "Wysyłka", icon: "mdi:package-variant" },
  { value: "BOTH", label: "Oba", icon: "mdi:check-all" },
];

function validate() {
  let ok = true;

  errors.title =
    form.title.trim().length < 3 ? "Nazwa musi mieć co najmniej 3 znaki" : null;
  if (errors.title) ok = false;

  errors.description =
    form.description.trim().length < 10
      ? "Opis musi mieć co najmniej 10 znaków"
      : null;
  if (errors.description) ok = false;

  errors.city = form.city.trim().length < 2 ? "Podaj miasto odbioru" : null;
  if (errors.city) ok = false;

  errors.type = !form.type ? "Wybierz typ ogłoszenia" : null;
  if (errors.type) ok = false;

  errors.deliveryMode = !form.deliveryMode
    ? "Wybierz sposób przekazania"
    : null;
  if (errors.deliveryMode) ok = false;

  return ok;
}

async function onSubmit() {
  serverError.value = null;
  if (!validate()) return;

  submitting.value = true;
  try {
    await $fetch("/api/listings", {
      method: "POST",
      body: { ...form },
    });
    await navigateTo("/listings");
  } catch (err: any) {
    serverError.value =
      err?.data?.statusMessage ?? "Coś poszło nie tak. Spróbuj ponownie.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
.add-page {
  display: grid;
  place-items: start center;
}

.add-shell {
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 2rem;

  @media (min-width: 1001px) {
    padding: 4rem 2rem;
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: color 0.2s;

  &:hover {
    color: var(--green-dark);
  }
}

h1 {
  font-size: 3rem;
  color: var(--green-dark);
  margin: 0;
}

.subtitle {
  font-size: 1.6rem;
  color: var(--text-muted);
  margin: -1.6rem 0 0;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    background: var(--surface);
    border: 1px solid var(--border-soft);
    border-radius: 2rem;
    padding: 2.8rem 2.4rem;
  }

  @media (min-width: 1001px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

.span-full {
  @media (min-width: 1001px) {
    grid-column: 1 / -1;
  }
}
button.span-full {
  @media (min-width: 1001px) {
    max-width: 400px;
    justify-self: end;
  }
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.field-label {
  font-size: 1.6rem;
  font-weight: 500;
  font-family: var(--font-title);
  color: var(--gray-text);
}

.field-error {
  font-size: 1.2rem;
  color: lightcoral;
  margin: 0;
}

textarea {
  padding: 1.4rem;
  border-radius: 1.2rem;
  border: none;
  font-size: 1.4rem;
  font-family: var(--font-ui);
  background-color: #eff3f1;
  resize: vertical;
  min-height: 12rem;
  color: var(--text-main);

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--gray-text);
  }
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.6rem;
  border-radius: 10rem;
  border: 2px solid var(--border-soft);
  background: var(--surface);
  font-size: 1.4rem;
  font-family: var(--font-ui);
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s;

  &:hover {
    border-color: var(--green-main);
    color: var(--green-dark);
  }

  &.active {
    border-color: var(--green-main);
    background: var(--green-soft);
    color: var(--green-dark);
    font-weight: 600;
  }
}

.server-error {
  font-size: 1.4rem;
  color: lightcoral;
  text-align: center;
  margin: 0;
}
</style>
