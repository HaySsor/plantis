<template>
  <div class="pending-page">
    <h1>Ogłoszenia oczekujące</h1>

    <div v-if="pending" class="state-info">Ładowanie...</div>

    <div v-else-if="!listings.length" class="state-info empty">
      <Icon name="mdi:check-circle-outline" class="empty-icon" />
      <span>Brak ogłoszeń do rozpatrzenia</span>
    </div>

    <div v-else class="listing-grid">
      <div v-for="item in listings" :key="item.id" class="listing-card">
        <div class="card-thumb">
          <img
            v-if="item.images[0]"
            :src="item.images[0].url"
            :alt="item.title"
          />
          <Icon v-else :name="typeIcon(item.type)" class="thumb-icon" />
        </div>

        <div class="card-body">
          <div class="card-meta">
            <span class="card-city">
              <Icon name="mdi:map-marker-outline" />
              {{ item.city }}
            </span>
            <span class="card-date">{{ formatDate(item.createdAt) }}</span>
          </div>
          <NuxtLink :to="`/zaplecze/listings/${item.id}`" class="card-title">{{
            item.title
          }}</NuxtLink>
          <p class="card-desc">{{ item.description }}</p>
          <div class="card-owner">
            <Icon name="mdi:account-outline" />
            {{ item.user.name ?? item.user.email }}
          </div>
        </div>

        <div class="card-actions">
          <DropdownMenu>
            <template #default>
              <NuxtLink
                :to="`/zaplecze/listings/${item.id}`"
                class="dropdown-item"
              >
                <Icon name="mdi:eye-outline" />
                Podgląd
              </NuxtLink>
              <button
                class="dropdown-item"
                :disabled="processing === item.id"
                @click="decide(item.id, 'ACTIVE')"
              >
                <Icon name="mdi:check" />
                Zatwierdź
              </button>
              <button
                class="dropdown-item dropdown-item--danger"
                :disabled="processing === item.id"
                @click="openRejectModal(item.id)"
              >
                <Icon name="mdi:close" />
                Odrzuć
              </button>
            </template>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal odrzucenia -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="rejectModal.open"
        class="modal-backdrop"
        @click.self="closeRejectModal"
      >
        <div class="modal">
          <h2 class="modal-title">Odrzuć ogłoszenie</h2>
          <p class="modal-desc">
            Podaj powód odrzucenia — użytkownik zobaczy go przy swoim
            ogłoszeniu.
          </p>
          <textarea
            v-model="rejectModal.reason"
            class="modal-textarea"
            placeholder="np. Zdjęcie nieczytelne, opis zbyt krótki..."
            rows="4"
            autofocus
          />
          <div class="modal-actions">
            <button
              class="modal-btn modal-btn--cancel"
              @click="closeRejectModal"
            >
              Anuluj
            </button>
            <button
              class="modal-btn modal-btn--reject"
              :disabled="processing === rejectModal.id"
              @click="confirmReject"
            >
              Odrzuć
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ["admin"], layout: "admin" });

interface PendingListing {
  id: string;
  title: string;
  description: string;
  city: string;
  type: string;
  createdAt: string;
  images: { url: string }[];
  user: { name: string | null; email: string };
}

const { data, pending } = await useFetch<{ listings: PendingListing[] }>(
  "/api/admin/listings/pending",
  {
    key: "admin-pending",
  },
);
const listings = computed(() => data.value?.listings ?? []);

const processing = ref<string | null>(null);

const rejectModal = reactive({
  open: false,
  id: null as string | null,
  reason: "",
});

function openRejectModal(id: string) {
  rejectModal.id = id;
  rejectModal.reason = "";
  rejectModal.open = true;
}

function closeRejectModal() {
  rejectModal.open = false;
}

async function confirmReject() {
  if (!rejectModal.id) return;
  await decide(rejectModal.id, "REJECTED", rejectModal.reason);
  closeRejectModal();
}

async function decide(
  id: string,
  status: "ACTIVE" | "REJECTED",
  rejectionReason?: string,
) {
  processing.value = id;
  try {
    await $fetch(`/api/admin/listings/${id}/status` as string, {
      method: "PATCH",
      body: { status, rejectionReason },
    });
    await refreshNuxtData("admin-pending");
  } finally {
    processing.value = null;
  }
}

function typeIcon(type: string) {
  return (
    {
      PLANT: "mdi:flower",
      CUTTING: "mdi:sprout",
      LEAF: "mdi:leaf",
      SEEDS: "mdi:seed-outline",
    }[type] ?? "mdi:flower"
  );
}

function formatDate(d: string) {
  const date = new Date(d);
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}
</script>

<style lang="scss" scoped>
.pending-page {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

h1 {
  font-family: var(--font-title);
  font-size: 3rem;
  color: #1a2e20;
  margin: 0;
}

.state-info {
  font-size: 1.5rem;
  color: var(--text-muted);

  &.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
    padding: 6rem 2rem;
    border: 2px dashed var(--border-soft);
    border-radius: 2rem;
    max-width: 50rem;
  }
}

.empty-icon {
  font-size: 4rem;
  color: var(--green-main);
  opacity: 0.5;
}

.listing-grid {
  display: grid;
  flex-direction: column;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.listing-card {
  display: flex;
  align-items: flex-start;
  gap: 1.6rem;
  background: #fff;
  border: 1px solid var(--border-soft);
  border-radius: 1.6rem;
  padding: 1.6rem;
}

.card-thumb {
  width: 8rem;
  height: 8rem;
  border-radius: 1rem;
  overflow: hidden;
  background: var(--green-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.thumb-icon {
  font-size: 3.2rem;
  color: var(--green-main);
  opacity: 0.6;
}

.card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  color: var(--text-muted);
}

.card-city {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.card-title {
  font-family: var(--font-title);
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a2e20;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc {
  font-size: 1.3rem;
  color: var(--text-muted);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-owner {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.2rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}

.card-actions {
  flex-shrink: 0;
}
</style>

<style lang="scss">
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 2rem;
}

.modal {
  background: #fff;
  border-radius: 2rem;
  padding: 2.8rem;
  width: 100%;
  max-width: 46rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.modal-title {
  font-family: var(--font-title);
  font-size: 2.2rem;
  color: #1a2e20;
  margin: 0;
}

.modal-desc {
  font-size: 1.4rem;
  color: var(--text-muted);
  margin: 0;
}

.modal-textarea {
  width: 100%;
  padding: 1.2rem;
  border-radius: 1rem;
  border: 1px solid var(--border-soft);
  font-size: 1.4rem;
  font-family: var(--font-ui);
  color: var(--text-main);
  resize: vertical;
  min-height: 10rem;

  &:focus {
    outline: 2px solid var(--green-main);
    outline-offset: 1px;
  }

  &::placeholder {
    color: var(--text-muted);
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-btn {
  padding: 0.9rem 2rem;
  border-radius: 999px;
  font-size: 1.4rem;
  font-family: var(--font-ui);
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition:
    background 0.15s,
    opacity 0.15s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--cancel {
    background: #f0f0f0;
    color: #444;

    &:hover:not(:disabled) {
      background: #e0e0e0;
    }
  }

  &--reject {
    background: #fee2e2;
    color: #991b1b;

    &:hover:not(:disabled) {
      background: #fecaca;
    }
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s;

  .modal {
    transition: transform 0.2s;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal {
    transform: scale(0.96);
  }
}
</style>
