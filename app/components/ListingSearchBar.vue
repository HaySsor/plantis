<template>
  <form class="listing-search-bar" @submit.prevent="handleSubmit">
    <div class="label-box">
      <label class="search-field">
        <Icon name="mdi:magnify" class="search-icon" />
        <input
          v-model="query"
          type="search"
          placeholder="Szukaj roślin (np. Monstera, Figowiec...)"
        />
      </label>

      <label class="search-field">
        <Icon name="mdi:map-marker" class="search-icon" />
        <input v-model="location" type="text" placeholder="Twoja lokalizacja" />
      </label>
    </div>

    <VButton
      class="search-submit"
      :is-button="true"
      type="dark"
      button-type="submit"
    >
      {{ buttonLabel }}
    </VButton>
  </form>
</template>

<script setup lang="ts">
type SearchPayload = {
  query: string;
  location: string;
};

const props = withDefaults(
  defineProps<{
    buttonLabel?: string;
    navigateOnSubmit?: boolean;
    navigateToPath?: string;
  }>(),
  {
    buttonLabel: "Znajdź roślinę",
    navigateOnSubmit: false,
    navigateToPath: "/listings",
  },
);

const emit = defineEmits<{
  submit: [payload: SearchPayload];
}>();

const query = ref("");
const location = ref("");

async function handleSubmit() {
  const payload = {
    query: query.value.trim(),
    location: location.value.trim(),
  };

  emit("submit", payload);

  if (props.navigateOnSubmit) {
    await navigateTo({
      path: props.navigateToPath,
      query: {
        q: payload.query || undefined,
        location: payload.location || undefined,
      },
    });
  }
}
</script>

<style scoped lang="scss">
.listing-search-bar {
  background: #ffffff;
  border-radius: 25px;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 16px 48px rgba(35, 68, 44, 0.12);
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
  width: 90%;

  @media (min-width: 768px) {
    max-width: 700px;
  }

  @media (min-width: 1200px) {
    max-width: 1100px;
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 10px;
  }
}

.label-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 20px;
  }
  @media (min-width: 1200px) {
    width: 100%;
  }
}

.search-field {
  border-radius: 999px;
  background: #eff3f1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 15px 20px;
  width: 100%;

  @media (min-width: 768px) {
    max-width: 410px;
  }
}

.search-icon {
  font-size: 2rem;
  color: #92a29a;
}

.search-field input {
  border: 0;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 1.4rem;
  color: #5f7468;
}

.search-field input::placeholder {
  color: #9ba9a2;
}
.listing-search-bar .search-submit {
  padding: 15px 40px;
  margin-top: 5px;

  @media (min-width: 1200px) {
    margin-left: auto;
    margin-top: 0;
    flex: 0 0 auto;
  }
}
</style>
