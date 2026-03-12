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
          <div class="chip-group">
            <button type="button" class="chip active" disabled>
              <Icon name="mdi:handshake" />
              Odbiór osobisty
            </button>
          </div>
        </div>

        <!-- Separator -->
        <div class="section-divider span-full">
          <span>Informacje o roślinie</span>
        </div>

        <!-- Podlewanie -->
        <div class="field-group">
          <label class="field-label">Podlewanie</label>
          <p v-if="errors.watering" class="field-error">
            {{ errors.watering }}
          </p>
          <div class="chip-group">
            <button
              v-for="opt in wateringOptions"
              :key="opt.value"
              type="button"
              class="chip"
              :class="{ active: form.watering === opt.value }"
              @click="form.watering = opt.value"
            >
              <Icon :name="opt.icon" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Światło -->
        <div class="field-group">
          <label class="field-label">Wymagania świetlne</label>
          <p v-if="errors.light" class="field-error">{{ errors.light }}</p>
          <div class="chip-group">
            <button
              v-for="opt in lightOptions"
              :key="opt.value"
              type="button"
              class="chip"
              :class="{ active: form.light === opt.value }"
              @click="form.light = opt.value"
            >
              <Icon :name="opt.icon" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Stanowisko -->
        <div class="field-group">
          <label class="field-label">Stanowisko</label>
          <p v-if="errors.position" class="field-error">
            {{ errors.position }}
          </p>
          <div class="chip-group">
            <button
              v-for="opt in positionOptions"
              :key="opt.value"
              type="button"
              class="chip"
              :class="{ active: form.position === opt.value }"
              @click="form.position = opt.value"
            >
              <Icon :name="opt.icon" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Wysokość -->
        <div class="field-group">
          <label class="field-label"
            >Wysokość <span class="optional">(opcjonalne)</span></label
          >
          <div class="chip-group">
            <button
              v-for="opt in heightOptions"
              :key="opt.value"
              type="button"
              class="chip"
              :class="{ active: form.height === opt.value }"
              @click="form.height = form.height === opt.value ? '' : opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Trudność -->
        <div class="field-group">
          <label class="field-label"
            >Trudność uprawy <span class="optional">(opcjonalne)</span></label
          >
          <div class="chip-group">
            <button
              v-for="opt in difficultyOptions"
              :key="opt.value"
              type="button"
              class="chip"
              :class="{ active: form.difficulty === opt.value }"
              @click="
                form.difficulty = form.difficulty === opt.value ? '' : opt.value
              "
            >
              <Icon :name="opt.icon" />
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Przyjazne dla zwierząt -->
        <div class="field-group">
          <label class="field-label"
            >Przyjazne dla zwierząt
            <span class="optional">(opcjonalne)</span></label
          >
          <div class="chip-group">
            <button
              type="button"
              class="chip"
              :class="{ active: form.petFriendly === true }"
              @click="
                form.petFriendly = form.petFriendly === true ? null : true
              "
            >
              <Icon name="mdi:paw" />
              Tak
            </button>
            <button
              type="button"
              class="chip"
              :class="{ active: form.petFriendly === false }"
              @click="
                form.petFriendly = form.petFriendly === false ? null : false
              "
            >
              <Icon name="mdi:paw-off" />
              Nie
            </button>
          </div>
        </div>

        <!-- Zdjęcia -->
        <div class="field-group span-full">
          <label class="field-label">Zdjęcia (maks. 2)</label>
          <div
            class="upload-row"
            @dragover.prevent="previews.length < 2 && (isDragging = true)"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
          >
            <div
              v-if="previews.length < 2"
              class="upload-zone"
              :class="{
                'is-dragging': isDragging,
                'is-compact': previews.length > 0,
              }"
              @click="fileInput?.click()"
            >
              <Icon name="mdi:image-plus-outline" class="upload-icon" />
              <span class="upload-hint">JPG / PNG<br />maks. 10 MB</span>
            </div>
            <div v-for="(p, i) in previews" :key="i" class="preview-item">
              <img
                :src="p.previewUrl"
                :alt="`Zdjęcie ${i + 1}`"
                class="preview-img"
              />
              <div v-if="p.uploading" class="preview-overlay">
                <Icon name="mdi:loading" class="spinner" />
              </div>
              <button
                v-else
                type="button"
                class="preview-remove"
                @click="removeImage(i)"
              >
                <Icon name="mdi:close" />
              </button>
            </div>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden-input"
            @change="onFileChange"
          />
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
  deliveryMode: "PICKUP",
  watering: "",
  light: "",
  position: "",
  height: "",
  difficulty: "",
  petFriendly: null as boolean | null,
});

const errors = reactive({
  title: null as string | null,
  description: null as string | null,
  city: null as string | null,
  type: null as string | null,
  watering: null as string | null,
  light: null as string | null,
  position: null as string | null,
});

const submitting = ref(false);
const serverError = ref<string | null>(null);

// --- image upload ---
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

interface Preview {
  previewUrl: string;
  uploadedUrl: string | null;
  uploading: boolean;
}
const previews = ref<Preview[]>([]);

async function uploadFile(file: File) {
  const idx = previews.value.length;
  previews.value.push({
    previewUrl: URL.createObjectURL(file),
    uploadedUrl: null,
    uploading: true,
  });
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await $fetch<{ url: string }>("/api/upload", {
      method: "POST",
      body: fd,
    });
    if (previews.value[idx]) previews.value[idx].uploadedUrl = res.url;
  } catch {
    previews.value.splice(idx, 1);
  } finally {
    if (previews.value[idx]) previews.value[idx].uploading = false;
  }
}

function addFiles(files: FileList | File[]) {
  const remaining = 2 - previews.value.length;
  Array.from(files).slice(0, remaining).forEach(uploadFile);
}

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files) addFiles(files);
  (e.target as HTMLInputElement).value = "";
}

function onDrop(e: DragEvent) {
  isDragging.value = false;
  if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
}

function removeImage(i: number) {
  previews.value.splice(i, 1);
}

const typeOptions = [
  { value: "PLANT", label: "Roślina", icon: "mdi:flower" },
  { value: "CUTTING", label: "Sadzonka", icon: "mdi:sprout" },
  { value: "LEAF", label: "Liść", icon: "mdi:leaf" },
  { value: "SEEDS", label: "Nasiona", icon: "mdi:seed" },
];

const wateringOptions = [
  { value: "LOW", label: "Sucholubne", icon: "mdi:water-off" },
  { value: "MEDIUM", label: "Umiarkowane", icon: "mdi:water" },
  { value: "HIGH", label: "Wilgociolubne", icon: "mdi:water-plus" },
];

const lightOptions = [
  { value: "LOW", label: "Cieniolubne", icon: "mdi:weather-night" },
  { value: "MEDIUM", label: "Półcień", icon: "mdi:weather-partly-cloudy" },
  { value: "HIGH", label: "Jasne stanowisko", icon: "mdi:weather-sunny" },
  { value: "FULL_SUN", label: "Pełne słońce", icon: "mdi:white-balance-sunny" },
];

const positionOptions = [
  { value: "INDOOR", label: "Domowe", icon: "mdi:home-outline" },
  { value: "OUTDOOR", label: "Zewnętrzne", icon: "mdi:tree-outline" },
  { value: "BOTH", label: "Oba", icon: "mdi:home-variant-outline" },
];

const heightOptions = [
  { value: "SMALL", label: "do 30 cm" },
  { value: "MEDIUM", label: "30–80 cm" },
  { value: "LARGE", label: "powyżej 80 cm" },
];

const difficultyOptions = [
  { value: "EASY", label: "Łatwa", icon: "mdi:emoticon-happy-outline" },
  { value: "MEDIUM", label: "Średnia", icon: "mdi:emoticon-neutral-outline" },
  { value: "HARD", label: "Trudna", icon: "mdi:emoticon-sad-outline" },
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

  errors.watering = !form.watering ? "Wybierz częstotliwość podlewania" : null;
  if (errors.watering) ok = false;

  errors.light = !form.light ? "Wybierz wymagania świetlne" : null;
  if (errors.light) ok = false;

  errors.position = !form.position ? "Wybierz stanowisko rośliny" : null;
  if (errors.position) ok = false;

  return ok;
}

async function onSubmit() {
  serverError.value = null;
  if (!validate()) return;

  submitting.value = true;
  try {
    const imageUrls = previews.value
      .filter((p) => p.uploadedUrl)
      .map((p) => p.uploadedUrl as string);
    await $fetch("/api/listings", {
      method: "POST",
      body: { ...form, imageUrls },
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
  max-width: 1300px;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
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
  background-color: #fff;
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

.section-divider {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  color: var(--text-muted);
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--border-soft);
  }
}

.optional {
  font-size: 1.2rem;
  font-weight: 400;
  color: var(--text-muted);
}

.server-error {
  font-size: 1.4rem;
  color: lightcoral;
  text-align: center;
  margin: 0;
}

.hidden-input {
  display: none;
}

.upload-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
}

.upload-zone {
  border: 2px dashed var(--border-soft);
  border-radius: 1.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  cursor: pointer;
  text-align: center;
  color: var(--text-muted);
  transition:
    border-color 0.2s,
    background 0.2s,
    width 0.2s,
    height 0.2s,
    border-radius 0.2s;

  // Domyślnie: full-width
  width: 100%;
  padding: 2.4rem;

  // Po dodaniu zdjęcia: kompaktowy kwadrat
  &.is-compact {
    width: 90px;
    height: 120px;
    padding: 0;
    border-radius: 1rem;
    flex-shrink: 0;
  }

  &:hover,
  &.is-dragging {
    border-color: var(--green-main);
    background: var(--green-soft);
    color: var(--green-dark);
  }
}

.upload-icon {
  font-size: 2.8rem;
  color: var(--green-main);

  .is-compact & {
    font-size: 2rem;
  }
}

.upload-hint {
  font-size: 1.3rem;
  color: var(--text-muted);
  line-height: 1.4;

  .is-compact & {
    font-size: 1rem;
  }
}

.preview-item {
  position: relative;
  width: 90px;
  height: 120px;
  border-radius: 1rem;
  overflow: hidden;
  flex-shrink: 0;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
}

.spinner {
  font-size: 2.4rem;
  color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.preview-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  border: none;
  cursor: pointer;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 1.4rem;
  transition: background 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
}
</style>
