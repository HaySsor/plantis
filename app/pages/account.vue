<template>
  <div class="dashboard">
    <!-- ── Top bar ── -->
    <header class="dash-header">
      <div class="dash-title-pill">
        <Icon name="mdi:view-dashboard-outline" />
        Panel użytkownika
      </div>
      <div class="dash-header-right">
        <div class="user-avatar-sm">{{ userInitial }}</div>
      </div>
    </header>

    <!-- Not logged in -->
    <div v-if="!loading && !user" class="not-logged">
      <p>Nie jesteś zalogowany.</p>
      <VButton :is-button="false" type="primary" href="/auth/login">
        Przejdź do logowania
      </VButton>
    </div>

    <!-- Dashboard body -->
    <div v-else-if="user" class="dash-body">
      <!-- Main card -->
      <div class="dash-card">
        <!-- Card header -->
        <div class="card-header">
          <h2 class="card-title">Witaj, {{ user.name }}!</h2>
          <div class="card-header-right">
            <button
              v-if="user.emailVerified"
              class="rank-badge rank-badge--verified"
              disabled
            >
              <Icon name="mdi:check-decagram" />
              Potwierdzony użytkownik
            </button>
            <button
              v-else
              class="rank-badge rank-badge--unverified"
              title="Potwierdź e-mail, aby uzyskać status zaufanego użytkownika"
              @click="openVerifyHint"
            >
              <Icon name="mdi:account-outline" />
              Zwykły użytkownik
            </button>
            <button
              class="gear-btn"
              :class="{ active: showSettings }"
              @click="showSettings = !showSettings"
            >
              <Icon :name="showSettings ? 'mdi:close' : 'mdi:cog-outline'" />
            </button>
          </div>
        </div>

        <!-- Card body: always renders both panes, CSS controls layout/visibility -->
        <div class="card-body" :class="{ 'settings-open': showSettings }">
          <!-- Dashboard pane -->
          <div class="dashboard-pane">
            <div class="card-grid">
              <!-- My active listings -->
              <div class="card-section">
                <h3 class="section-label">Twoje aktywne ogłoszenia</h3>
                <div v-if="listingsPending" class="section-loading">
                  <Icon name="mdi:loading" class="spin" /> Ładowanie...
                </div>
                <div v-else-if="!myListings.length" class="section-empty">
                  Nie masz jeszcze żadnych ogłoszeń
                </div>
                <div v-else class="listing-list">
                  <div
                    v-for="item in myListings"
                    :key="item.id"
                    class="listing-row"
                  >
                    <div class="listing-thumb">
                      <img
                        v-if="item.images[0]"
                        :src="item.images[0].url"
                        :alt="item.title"
                      />
                      <Icon
                        v-else
                        :name="typeIcon(item.type)"
                        class="thumb-icon"
                      />
                    </div>
                    <div class="listing-info">
                      <div class="listing-name-row">
                        <NuxtLink
                          :to="`/listings/${item.id}`"
                          class="listing-name"
                          >{{ item.title }}</NuxtLink
                        >
                        <span
                          class="listing-status"
                          :class="`status--${item.status.toLowerCase()}`"
                        >
                          {{ statusLabel(item.status) }}
                        </span>
                      </div>
                      <p
                        v-if="
                          item.status === 'REJECTED' && item.rejectionReason
                        "
                        class="rejection-reason"
                      >
                        <Icon name="mdi:alert-circle-outline" />
                        {{ item.rejectionReason }}
                      </p>
                      <span class="listing-date"
                        >Dodana: {{ formatDate(item.createdAt) }}</span
                      >
                    </div>
                    <DropdownMenu>
                      <NuxtLink
                        :to="`/listings/${item.id}`"
                        class="dropdown-item"
                      >
                        <Icon name="mdi:eye-outline" />
                        Podgląd
                      </NuxtLink>
                      <NuxtLink
                        :to="`/listings/edit/${item.id}`"
                        class="dropdown-item"
                      >
                        <Icon name="mdi:pencil-outline" />
                        Edytuj
                      </NuxtLink>
                      <button
                        class="dropdown-item dropdown-item--danger"
                        @click="openDeleteModal(item)"
                      >
                        <Icon name="mdi:trash-can-outline" />
                        Usuń
                      </button>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              <!-- Favorites -->
              <div class="card-section">
                <h3 class="section-label">Rośliny, które obserwujesz</h3>
                <div v-if="favoritesPending" class="section-loading">
                  <Icon name="mdi:loading" class="spin" /> Ładowanie...
                </div>
                <div v-else-if="!myFavorites.length" class="section-empty">
                  <Icon name="mdi:heart-outline" class="empty-icon" />
                  <span>Nie masz jeszcze ulubionych</span>
                </div>
                <div v-else class="listing-list">
                  <div
                    v-for="item in myFavorites"
                    :key="item.id"
                    class="listing-row"
                  >
                    <div class="listing-thumb">
                      <img
                        v-if="item.images[0]"
                        :src="item.images[0].url"
                        :alt="item.title"
                      />
                      <Icon
                        v-else
                        :name="typeIcon(item.type)"
                        class="thumb-icon"
                      />
                    </div>
                    <div class="listing-info">
                      <NuxtLink
                        :to="`/listings/${item.id}`"
                        class="listing-name"
                        >{{ item.title }}</NuxtLink
                      >
                      <span class="listing-date">{{ item.city }}</span>
                    </div>
                    <button
                      class="fav-remove-btn"
                      @click="removeFavorite(item.id)"
                    >
                      <Icon name="mdi:heart" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings pane -->
          <div class="settings-pane">
            <div class="settings-inner">
              <AccountSettingsPanel
                ref="settingsPanel"
                :items="settingsItems"
                @logout="onLogout"
              >
                <template #profil>
                  <div class="profil-section">
                    <h2 class="section-title">Profil</h2>
                    <div class="settings-group-inner">
                      <!-- Email verification row -->
                      <div class="ios-row">
                        <span
                          class="ios-row-icon"
                          :class="
                            user.emailVerified
                              ? 'ios-row-icon--ok'
                              : 'ios-row-icon--warn'
                          "
                        >
                          <Icon
                            :name="
                              user.emailVerified
                                ? 'mdi:check-decagram'
                                : 'mdi:email-alert-outline'
                            "
                          />
                        </span>
                        <div class="ios-row-body">
                          <span class="ios-row-label">E-mail</span>
                          <span
                            class="ios-row-value"
                            :class="
                              user.emailVerified ? 'value--ok' : 'value--warn'
                            "
                          >
                            {{
                              user.emailVerified
                                ? "Potwierdzony"
                                : "Niepotwierdzony"
                            }}
                          </span>
                        </div>
                        <button
                          v-if="!user.emailVerified"
                          class="ios-row-action"
                          :disabled="verifyLoading"
                          @click="sendVerification"
                        >
                          {{ verifyLoading ? "..." : "Wyślij link" }}
                        </button>
                        <Icon v-else name="mdi:check" class="ios-row-check" />
                      </div>

                      <!-- Change password row -->
                      <NuxtLink to="/account-change-password" class="ios-row ios-row--link">
                        <span class="ios-row-icon ios-row-icon--pwd">
                          <Icon name="mdi:lock-outline" />
                        </span>
                        <div class="ios-row-body">
                          <span class="ios-row-label">Hasło</span>
                        </div>
                        <Icon name="mdi:chevron-right" class="ios-row-chevron" />
                      </NuxtLink>
                    </div>
                    <p
                      v-if="verifyMsg"
                      class="verify-msg"
                      :class="verifyMsgType"
                    >
                      {{ verifyMsg }}
                    </p>
                  </div>
                </template>
              </AccountSettingsPanel>
            </div>
          </div>
        </div>

        <!-- Footer — always visible, outside animated area -->
        <div class="card-footer">
          <div class="footer-nav"></div>
          <div class="footer-actions">
            <NuxtLink to="/listings/add" class="add-btn">
              <Icon name="mdi:plus-circle" />
              Dodaj ogłoszenie
            </NuxtLink>
            <button class="logout-btn" @click="onLogout">
              <Icon name="mdi:logout" />
              Wyloguj
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :open="deleteModal.open"
    title="Usuń ogłoszenie"
    :message="`Czy na pewno chcesz usunąć ogłoszenie &quot;${deleteModal.title}&quot;? Tej operacji nie można cofnąć.`"
    confirm-label="Usuń"
    :loading="deleteModal.loading"
    @confirm="confirmDelete"
    @cancel="closeDeleteModal"
  />
</template>

<script setup lang="ts">
const { user, loading, fetchMe, logout } = useAuth();


const userInitial = computed(() =>
  (user.value?.name?.charAt(0) ?? "U").toUpperCase(),
);

const showSettings = ref(false);
const settingsPanel = ref<{ navigate: (key: string) => void } | null>(null);

function openVerifyHint() {
  showSettings.value = true;
  nextTick(() => settingsPanel.value?.navigate("profil"));
}

const verifyLoading = ref(false);
const verifyMsg = ref("");
const verifyMsgType = ref<"ok" | "error">("ok");

async function sendVerification() {
  verifyLoading.value = true;
  verifyMsg.value = "";
  try {
    await $fetch("/api/auth/send-verification", { method: "POST" });
    verifyMsg.value = "Link weryfikacyjny został wysłany. Sprawdź skrzynkę.";
    verifyMsgType.value = "ok";
  } catch (e: any) {
    verifyMsg.value =
      e?.data?.statusMessage ?? "Wystąpił błąd. Spróbuj ponownie.";
    verifyMsgType.value = "error";
  } finally {
    verifyLoading.value = false;
  }
}

const settingsItems = [
  {
    key: "profil",
    label: "Profil",
    icon: "mdi:account-outline",
    color: "#5b9ed6",
  },
  { key: "ranga", label: "Ranga", icon: "mdi:star-outline", color: "#f0a030" },
  {
    key: "preferencje",
    label: "Preferencje",
    icon: "mdi:tune",
    color: "#9b6dd1",
  },
  {
    key: "domyslne-filtry",
    label: "Domyślne filtry",
    icon: "mdi:filter-outline",
    color: "#50b990",
  },
];

interface MyListing {
  id: string;
  title: string;
  type: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  images: { url: string }[];
}

const { data: listingsData, pending: listingsPending } = useFetch<{
  listings: MyListing[];
}>("/api/listings/my", { lazy: true });
const myListings = computed(() => listingsData.value?.listings ?? []);

const {
  data: favoritesData,
  pending: favoritesPending,
  refresh: refreshFavorites,
} = useFetch("/api/favorites/listings", { lazy: true });
const myFavorites = computed(() => favoritesData.value?.items ?? []);

const { toggle: toggleFavorite } = useFavorites();
async function removeFavorite(id: string) {
  await toggleFavorite(id);
  await refreshFavorites();
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

function statusLabel(status: string) {
  return (
    { PENDING: "Oczekujące", ACTIVE: "Aktywne", REJECTED: "Odrzucone" }[
      status
    ] ?? status
  );
}

function formatDate(d: string) {
  const date = new Date(d);
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getFullYear()).slice(2)}`;
}

async function onLogout() {
  await logout();
  await navigateTo("/auth/login");
}

// --- delete modal ---
const { success, error: toastError } = useToast();

const deleteModal = reactive({
  open: false,
  id: "",
  title: "",
  loading: false,
});

function openDeleteModal(item: { id: string; title: string }) {
  deleteModal.id = item.id;
  deleteModal.title = item.title;
  deleteModal.open = true;
}

function closeDeleteModal() {
  deleteModal.open = false;
}

async function confirmDelete() {
  deleteModal.loading = true;
  try {
    await $fetch(`/api/listings/${deleteModal.id}` as string, {
      method: "DELETE",
    });
    listingsData.value = {
      listings: (listingsData.value?.listings ?? []).filter(
        (l) => l.id !== deleteModal.id,
      ),
    };
    success("Ogłoszenie zostało usunięte.");
    closeDeleteModal();
  } catch {
    toastError("Nie udało się usunąć ogłoszenia.");
  } finally {
    deleteModal.loading = false;
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: calc(100dvh - 10rem);
}

/* ── Top bar ── */
.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
}

.dash-title-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.8rem;
  border-radius: 999px;
  font-size: 2rem;
  font-weight: 600;
  font-family: var(--font-ui);
}

.dash-header-right {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.user-avatar-sm {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--green-soft);
  color: var(--green-dark);
  font-size: 1.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--green-main);
}

/* ── Body ── */
.dash-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;

  @media (min-width: 900px) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2.4rem;
    align-items: start;
  }
}

/* ── Left image ── */
.dash-image {
  display: none;

  @media (min-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: sticky;
    top: 2rem;

    img {
      width: 100%;
      object-fit: contain;
    }
  }
}

/* ── Main card ── */
.dash-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 2.4rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 640px) {
    max-height: 76rem;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 2rem 2.4rem 1.6rem;
  border-bottom: 1px solid var(--border-soft);
  flex-shrink: 0;
  background-color: #f4f5f4;
}

.card-header-right {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.card-title {
  font-family: var(--font-title);
  font-size: 2.2rem;
  font-weight: 600;
  color: var(--green-dark);
  margin: 0;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: default;
  font-family: var(--font-ui);

  &--verified {
    border: 1.5px solid var(--green-main);
    background: var(--green-soft);
    color: var(--green-dark);
  }

  &--unverified {
    border: 1.5px solid #d1b87a;
    background: #fef9ec;
    color: #7a5c1e;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: #fdf0c4;
    }
  }
}

.gear-btn {
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
  border: 1.5px solid var(--border-soft);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    border-color 0.15s,
    color 0.15s,
    background 0.15s;

  &:hover {
    border-color: var(--green-main);
    color: var(--green-dark);
  }

  &.active {
    border-color: var(--green-main);
    background: var(--green-soft);
    color: var(--green-dark);
  }
}

/* ── Card body — two panes ── */
.card-body {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
  position: relative;

  @media (min-width: 640px) {
    min-height: 48rem;
  }
}

/* Dashboard pane — always occupies remaining space */
.dashboard-pane {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;

  /* Mobile: slide left when settings open */
  transition:
    transform 0.36s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.36s;

  .settings-open & {
    @media (max-width: 639px) {
      transform: translateX(-8%);
      opacity: 0;
      pointer-events: none;
    }
  }
}

/* Settings pane */
.settings-pane {
  flex-shrink: 0;
  overflow: hidden;

  /* Mobile: absolute overlay slides in from right */
  @media (max-width: 639px) {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: var(--surface);
    transform: translateX(100%);
    transition: transform 0.36s cubic-bezier(0.4, 0, 0.2, 1);

    .settings-open & {
      transform: translateX(0);
    }
  }

  /* Desktop: expands from 0 to 50% width */
  @media (min-width: 640px) {
    width: 0;
    transition: width 0.36s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 0px solid var(--border-soft);

    .settings-open & {
      width: 50%;
      border-left-width: 1px;
    }
  }
}

/* Inner wrapper keeps content at full width during animation */
.settings-inner {
  height: 100%;

  @media (min-width: 640px) {
    min-width: 28rem;
  }
}

/* Strip AccountSettingsPanel's own card styling */
:deep(.settings-panel) {
  background: transparent;
  border: none;
  border-radius: 0;
}

/* ── Content grid ── */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  flex: 1;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
}

.card-section {
  padding: 1.6rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  min-width: 0;
  overflow: hidden;

  & + & {
    border-top: 1px solid var(--border-soft);

    @media (min-width: 640px) {
      border-top: none;
      border-left: 1px solid var(--border-soft);
    }
  }
}

.section-label {
  font-size: 2rem;
  font-weight: 500;
  color: var(--text-main);
  margin: 0;
  text-align: center;
}

.section-loading,
.section-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 2.4rem 1rem;
  font-size: 1.3rem;
  color: var(--text-muted);
  text-align: center;
}

.empty-icon {
  font-size: 2.8rem;
  opacity: 0.4;
}

/* ── Listing rows ── */
.listing-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  overscroll-behavior: contain;

  @media (min-width: 640px) {
    max-height: 28rem;
    overflow-y: auto;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--border-soft);
    border-radius: 2px;
  }
}

.listing-row {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem 1.2rem;
  border-radius: 1.2rem;
  border: 1px solid var(--border-soft);
  box-shadow: 0 0 10px var(--bg);
  min-width: 0;
  overflow: hidden;
}

.listing-thumb {
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 0.8rem;
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
  font-size: 2.4rem;
  color: var(--green-main);
}

.listing-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
  overflow: hidden;
}

.listing-name-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 639px) {
    display: block;
  }
}

.listing-name {
  display: block;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.listing-status {
  flex-shrink: 0;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;

  &.status--pending {
    background: #fef3c7;
    color: #92400e;
  }

  &.status--active {
    background: var(--green-soft);
    color: var(--green-dark);
  }

  &.status--rejected {
    background: #fee2e2;
    color: #991b1b;
  }
}

.listing-date {
  font-size: 1.2rem;
  color: var(--text-muted);
}

.rejection-reason {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #991b1b;
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-radius: 0.8rem;
  padding: 0.6rem 0.9rem;
  margin: 0;
  line-height: 1.5;
}

/* ── Footer ── */
.card-footer {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1.6rem 2rem;
  border-top: 1px solid var(--border-soft);
  background-color: #f4f5f4;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    gap: 1.6rem;
  }
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 500;
  text-decoration: none;
  color: var(--text-muted);
}

.nav-active {
  color: var(--green-dark);
  font-weight: 600;
}
.nav-muted {
  opacity: 0.5;
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 2rem;
  border-radius: 999px;
  background: var(--green-dark);
  color: #fff;
  font-size: 1.4rem;
  font-weight: 600;
  font-family: var(--font-ui);
  text-decoration: none;
  transition: background 0.15s;

  &:hover {
    background: #234a2b;
  }
}

.fav-remove-btn {
  flex-shrink: 0;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  border: 1.5px solid #fca5a5;
  background: #fff;
  color: #e05a7a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #fef2f2;
  }
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.4rem;
  border-radius: 999px;
  border: 1px solid #fca5a5;
  background: white;
  color: #b91c1c;
  font-size: 1.3rem;
  font-family: var(--font-ui);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.12s;

  &:hover {
    background: #fef2f2;
  }
}

/* ── Profil section ── */
.section-title {
  font-family: var(--font-title);
  font-size: 2rem;
  font-weight: 700;
  color: var(--green-dark);
  margin: 0 0 1.2rem;
}

.profil-section {
  padding: 0 1.2rem 1.6rem;
}

.settings-group-inner {
  border-radius: 1.4rem;
  overflow: hidden;
  border: 1px solid var(--border-soft);
  background: var(--bg);
}

/* iOS-style row */
.ios-row {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.1rem 1.4rem;
}

.ios-row--link {
  text-decoration: none;
  color: var(--text-main);
  border-top: 1px solid var(--border-soft);
  transition: background 0.12s;

  &:hover { background: var(--green-soft); }
}

.ios-row-chevron {
  font-size: 1.8rem;
  color: var(--text-muted);
  opacity: 0.5;
  flex-shrink: 0;
}

.ios-row-icon {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.9rem;
  color: #fff;
  flex-shrink: 0;

  &--ok   { background: var(--green-main); }
  &--warn { background: #d97706; }
  &--pwd  { background: #6d7a9f; }
}

.ios-row-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  min-width: 0;
}

.ios-row-label {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-main);
}

.ios-row-value {
  font-size: 1.3rem;
  font-weight: 500;

  &.value--ok {
    color: var(--green-main);
  }
  &.value--warn {
    color: #d97706;
  }
}

.ios-row-action {
  flex-shrink: 0;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  border: 1.5px solid var(--green-main);
  background: var(--green-soft);
  color: var(--green-dark);
  font-size: 1.25rem;
  font-weight: 600;
  font-family: var(--font-ui);
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #c5e8c8;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.ios-row-check {
  font-size: 2rem;
  color: var(--green-main);
  flex-shrink: 0;
}

.verify-msg {
  font-size: 1.3rem;
  border-radius: 0.8rem;
  padding: 0.8rem 1.2rem;
  margin-top: 0.8rem;

  &.ok {
    background: #f0fdf4;
    color: #166534;
    border: 1px solid #bbf7d0;
  }
  &.error {
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }
}

/* ── Misc ── */
.not-logged {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  padding: 4rem 2rem;
  font-size: 1.6rem;
  color: var(--text-muted);
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
