<template>
  <header class="navbar">
    <NuxtLink to="/" class="logo">
      <span class="logo-mark">
        <Icon name="mdi:leaf" class="logo-mark-icon" />
      </span>
      <span class="logo-text">Zielona<span>Przesiadka</span></span>
    </NuxtLink>

    <div
      ref="mobileSearchRef"
      class="mobile-search"
      :class="{ 'is-open': mobileSearchOpen }"
    >
      <button
        class="mobile-search-toggle"
        type="button"
        aria-label="Otwórz wyszukiwarkę"
        @click="toggleMobileSearch"
      >
        <Icon name="mdi:magnify" class="mobile-search-icon" />
      </button>
      <input
        v-if="mobileSearchOpen"
        ref="mobileSearchInput"
        class="mobile-search-input"
        type="search"
        placeholder="Szukaj"
        aria-label="Szukaj"
        @keydown.esc="closeMobileSearch"
      />
    </div>

    <nav class="nav-desktop" aria-label="Główne menu">
      <a href="#jak-to-dziala">Jak to działa</a>
      <a href="#spolecznosc">Społeczność</a>
      <a href="#o-nas">O nas</a>
    </nav>

    <div class="desktop-actions">
      <div
        ref="desktopSearchRef"
        class="desktop-search"
        :class="{ 'is-open': desktopSearchOpen }"
      >
        <button
          class="desktop-search-toggle"
          type="button"
          aria-label="Otwórz wyszukiwarkę"
          @click="toggleDesktopSearch"
        >
          <Icon name="mdi:magnify" class="desktop-search-icon" />
        </button>
        <input
          v-if="desktopSearchOpen"
          ref="desktopSearchInput"
          class="desktop-search-input"
          type="search"
          placeholder="Szukaj"
          aria-label="Szukaj"
          @keydown.esc="closeDesktopSearch"
        />
      </div>
      <span class="divider" aria-hidden="true"></span>
      <NuxtLink :to="user ? '/account' : '/auth/login'" class="login-btn">
        <span>{{ user ? "Moje konto" : "Zaloguj się" }}</span>
      </NuxtLink>
    </div>
  </header>

  <nav class="bottom-nav" aria-label="Mobilne menu">
    <a
      href="#jak-to-dziala"
      class="bottom-link"
      :class="{ 'is-active': activeMobileTab === 'jak-to-dziala' }"
      @click="setActiveMobileTab('jak-to-dziala')"
    >
      <Icon
        size="24"
        name="mdi:book-open-page-variant-outline"
        class="bottom-link-icon"
      />
      <span>Jak działa</span>
    </a>
    <a
      href="#spolecznosc"
      class="bottom-link"
      :class="{ 'is-active': activeMobileTab === 'spolecznosc' }"
      @click="setActiveMobileTab('spolecznosc')"
    >
      <Icon
        size="24"
        name="mdi:account-group-outline"
        class="bottom-link-icon"
      />
      <span>Społecz.</span>
    </a>
    <a
      href="#o-nas"
      class="bottom-link"
      :class="{ 'is-active': activeMobileTab === 'o-nas' }"
      @click="setActiveMobileTab('o-nas')"
    >
      <Icon size="24" name="mdi:information-outline" class="bottom-link-icon" />
      <span>O nas</span>
    </a>
    <NuxtLink :to="user ? '/account' : '/auth/login'" class="bottom-link">
      <Icon
        v-if="!user"
        size="24"
        name="mdi:login-variant"
        class="bottom-link-icon"
      />
      <Icon
        v-else
        size="24"
        name="mdi:account-circle-outline"
        class="bottom-link-icon"
      />
      <span>{{ user ? "Moje konto" : "Zaloguj się" }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";

const activeMobileTab = ref("jak-to-dziala");
const mobileSearchOpen = ref(false);
const mobileSearchInput = ref<HTMLInputElement | null>(null);
const mobileSearchRef = ref<HTMLElement | null>(null);
const desktopSearchOpen = ref(false);
const desktopSearchInput = ref<HTMLInputElement | null>(null);
const desktopSearchRef = ref<HTMLElement | null>(null);
const { user, fetchMe } = useAuth();

const setActiveMobileTab = (tab: "jak-to-dziala" | "spolecznosc" | "o-nas") => {
  activeMobileTab.value = tab;
};

const syncTabWithHash = () => {
  const hash = window.location.hash.replace("#", "");
  if (hash === "jak-to-dziala" || hash === "spolecznosc" || hash === "o-nas") {
    activeMobileTab.value = hash;
  }
};

const toggleMobileSearch = async () => {
  mobileSearchOpen.value = !mobileSearchOpen.value;
  if (mobileSearchOpen.value) {
    await nextTick();
    mobileSearchInput.value?.focus();
  }
};

const closeMobileSearch = () => {
  mobileSearchOpen.value = false;
};

const toggleDesktopSearch = async () => {
  desktopSearchOpen.value = !desktopSearchOpen.value;
  if (desktopSearchOpen.value) {
    await nextTick();
    desktopSearchInput.value?.focus();
  }
};

const closeDesktopSearch = () => {
  desktopSearchOpen.value = false;
};

const handleDocumentClick = (event: MouseEvent) => {
  if (!(event.target instanceof Node)) {
    return;
  }
  if (mobileSearchRef.value && !mobileSearchRef.value.contains(event.target)) {
    closeMobileSearch();
  }
  if (
    desktopSearchRef.value &&
    !desktopSearchRef.value.contains(event.target)
  ) {
    closeDesktopSearch();
  }
};

onMounted(() => {
  fetchMe().catch(() => {});
  syncTabWithHash();
  window.addEventListener("hashchange", syncTabWithHash);
  document.addEventListener("click", handleDocumentClick);
});

onUnmounted(() => {
  window.removeEventListener("hashchange", syncTabWithHash);
  document.removeEventListener("click", handleDocumentClick);
});
</script>

<style lang="scss">
a {
  color: inherit;
  text-decoration: none;
}

.navbar {
  max-width: 1300px;
  margin: 0 auto;
  background: #f8fffa;
  border: 1px solid #d5ead9;
  border-radius: 22px;
  padding: 1rem 1.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  box-shadow: 0 10px 28px rgba(61, 106, 72, 0.08);

  @media (min-width: 1001px) {
    justify-content: space-between;
    padding: 1.2rem 1.6rem;
  }
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-weight: 600;
}

.logo-mark {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #d7f4dd;
}

.logo-mark-icon {
  font-size: 3rem;
  color: #2fd063;
}

.logo-text {
  font-size: 1.3rem;
  letter-spacing: -0.01em;
  font-weight: 600;
  color: #1d2f20;

  @media (min-width: 768px) {
    font-size: 2.2rem;
  }

  @media (min-width: 1200px) {
    display: inline;
    font-size: 2.1rem;
  }
}

.logo-text span {
  color: #2fd063;
}

.nav-desktop {
  display: none;
  gap: 2rem;

  @media (min-width: 1001px) {
    display: flex;
  }
}

.nav-desktop a {
  padding: 0.25rem 0.1rem;
  font-weight: 600;
  font-size: 1.5rem;
  color: #4f5e55;
  border-bottom: 2px solid transparent;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.nav-desktop a:hover {
  color: #263c2e;
  border-bottom-color: #57c57a;
}

.desktop-actions {
  display: none;
  align-items: center;
  margin-left: auto;
  gap: 1rem;

  @media (min-width: 1001px) {
    display: inline-flex;
  }
}

.mobile-search {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: auto;
  width: 4rem;
  height: 4rem;
  padding: 0.3rem;
  border: 1px solid #d6e6d9;
  border-radius: 999px;
  background: #fff;
  overflow: hidden;
  transition:
    width 0.22s ease,
    padding 0.22s ease;

  @media (min-width: 1001px) {
    display: none;
  }
}

.mobile-search.is-open {
  width: min(58vw, 18rem);
  padding: 0.45rem 0.65rem;
  gap: 0.45rem;
}

.mobile-search-toggle {
  width: 3.2rem;
  height: 3.2rem;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eff7f0;
  cursor: pointer;
}

.mobile-search-icon {
  font-size: 1.8rem;
  color: #5f6f66;
}

.mobile-search-input {
  border: 0;
  outline: none;
  background: transparent;
  flex: 1;
  min-width: 0;
  font-size: 1.35rem;
  color: #33443a;
}

.mobile-search-input::placeholder {
  color: #7a8b80;
}

.desktop-search {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: 4rem;
  height: 4rem;
  padding: 0.3rem;
  border: 1px solid #d6e6d9;
  border-radius: 999px;
  background: #fff;
  overflow: hidden;
  transition:
    width 0.22s ease,
    padding 0.22s ease;
}

.desktop-search.is-open {
  width: min(24vw, 180rem);
  padding: 0.45rem 0.65rem;
  gap: 0.45rem;
}

.desktop-search-toggle {
  width: 3.2rem;
  height: 3.2rem;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eff7f0;
  cursor: pointer;
}

.desktop-search-icon {
  font-size: 2rem;
  color: #5f6f66;
}

.desktop-search-input {
  border: 0;
  outline: none;
  background: transparent;
  flex: 1;
  min-width: 0;
  font-size: 1.35rem;
  color: #33443a;
}

.desktop-search-input::placeholder {
  color: #7a8b80;
}

.divider {
  width: 1px;
  height: 2.1rem;
  background: #d7ddd8;
}

.login-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 4rem;
  padding: 0 1.8rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #d7f4dd, #d7f4dd);
  color: #187536;
  font-size: 1.45rem;
  font-weight: 600;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.login-btn svg {
  width: 1.4rem;
  height: 1.4rem;
  fill: currentColor;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(33, 191, 86, 0.34);
  filter: brightness(1.03);
}

.bottom-nav {
  display: grid;
  position: fixed;
  left: 0.9rem;
  right: 0.9rem;
  bottom: 0.9rem;
  bottom: calc(env(safe-area-inset-bottom) + 0.9rem);
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  padding: 0.45rem;
  box-shadow: 0 10px 26px rgba(53, 97, 63, 0.16);
  backdrop-filter: blur(6px);
  grid-template-columns: repeat(4, 1fr);
  gap: 0.35rem;
  z-index: 20;
  max-width: 400px;
  margin: 0 auto;

  @media (min-width: 1001px) {
    display: none;
  }
}

.bottom-link {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 0.25rem;
  min-height: 3.6rem;
  border-radius: 12px;
  padding: 5px;
  color: var(--text-muted);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.bottom-link-icon {
  font-size: 3rem;
  color: currentColor;
}

.bottom-link span {
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.bottom-link.is-active,
.bottom-link:hover {
  background: var(--green-soft);
  color: var(--green-dark);
  transform: translateY(-1px);
}
</style>
