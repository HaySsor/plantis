<template>
  <main class="add-page">
    <div class="add-shell">
      <NuxtLink to="/account" class="back-link">
        <Icon name="mdi:arrow-left" />
        Moje konto
      </NuxtLink>

      <div v-if="fetchPending" class="loading-state">
        <Icon name="mdi:loading" class="spin" /> Ładowanie ogłoszenia...
      </div>

      <template v-else-if="listing">
        <h1>Edytuj ogłoszenie</h1>
        <p class="subtitle">Zaktualizuj informacje o roślinie</p>

        <div v-if="listing.status === 'REJECTED' && listing.rejectionReason" class="rejection-banner">
          <Icon name="mdi:alert-circle-outline" class="rejection-icon" />
          <div>
            <strong>Ogłoszenie zostało odrzucone</strong>
            <p>{{ listing.rejectionReason }}</p>
          </div>
        </div>

        <ListingForm
          mode="edit"
          :initial-data="listing"
          :submitting="submitting"
          :server-error="serverError"
          @submit="onSubmit"
        />
      </template>

      <div v-else class="loading-state">Nie znaleziono ogłoszenia.</div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { ListingFormData } from "~/components/ListingForm.vue";

const route = useRoute();
const id = route.params.id as string;
const { user, fetchMe } = useAuth();
const { success, error: toastError } = useToast();

onMounted(async () => {
  await fetchMe().catch(() => {});
  if (!user.value) await navigateTo("/auth/login");
});

const { data, pending: fetchPending } = await useFetch<{ listing: Record<string, any> }>(
  `/api/listings/${id}`,
);
const listing = computed(() => data.value?.listing ?? null);

const submitting = ref(false);
const serverError = ref<string | null>(null);

async function onSubmit(data: ListingFormData & { imageUrls: string[] }) {
  serverError.value = null;
  submitting.value = true;
  try {
    await $fetch(`/api/listings/${id}` as string, {
      method: "PATCH",
      body: data,
    });
    success("Ogłoszenie zostało wysłane do weryfikacji.");
    await navigateTo("/account");
  } catch (err: any) {
    serverError.value = err?.data?.statusMessage ?? "Coś poszło nie tak. Spróbuj ponownie.";
    toastError(serverError.value!);
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

.rejection-banner {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  background: #fff5f5;
  border: 1px solid #fca5a5;
  border-left: 4px solid #ef4444;
  border-radius: 1.2rem;
  padding: 1.6rem 2rem;
  color: #991b1b;

  strong {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 0.4rem;
  }

  p {
    font-size: 1.4rem;
    margin: 0;
    line-height: 1.6;
    color: #b91c1c;
  }
}

.rejection-icon {
  font-size: 2.2rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.6rem;
  color: var(--text-muted);
  padding: 4rem 0;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
