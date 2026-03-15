<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <Icon name="mdi:leaf" class="brand-icon" />
        <span>Plantis <em>admin</em></span>
      </div>

      <nav class="admin-nav">
        <NuxtLink to="/zaplecze" class="admin-nav-link" exact>
          <Icon name="mdi:view-dashboard-outline" />
          Dashboard
        </NuxtLink>
        <NuxtLink to="/zaplecze/listings" class="admin-nav-link">
          <Icon name="mdi:clock-outline" />
          Ogłoszenia
          <span v-if="pendingCount" class="nav-badge">{{ pendingCount }}</span>
        </NuxtLink>
      </nav>

      <button class="admin-logout" @click="onLogout">
        <Icon name="mdi:logout" />
        Wyloguj
      </button>
    </aside>

    <div class="admin-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const { logout } = useAuth();

async function onLogout() {
  await logout();
  await navigateTo("/zaplecze/login");
}

const { data: pendingData } = await useFetch("/api/admin/listings/pending", { key: "admin-pending" });
const pendingCount = computed(() => pendingData.value?.listings?.length ?? 0);
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
</style>

<style lang="scss" scoped>
.admin-shell {
  display: flex;
  min-height: 100dvh;
  background: #f0f2f0;
}

.admin-sidebar {
  width: 22rem;
  background: #1a2e20;
  color: #c8d8c4;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.4rem;
  gap: 2rem;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100dvh;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.4rem 0.6rem 1.6rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 1.7rem;
  font-weight: 700;
  font-family: var(--font-title);
  color: #fff;

  em {
    font-style: normal;
    color: var(--green-main);
    font-weight: 400;
  }
}

.brand-icon {
  font-size: 2.2rem;
  color: var(--green-main);
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}

.admin-nav-link {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  font-size: 1.5rem;
  font-weight: 500;
  color: #a8c0a4;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
  }

  &.router-link-active {
    background: rgba(120, 168, 126, 0.18);
    color: #fff;
  }
}

.nav-badge {
  margin-left: auto;
  background: #f59e0b;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  line-height: 1.6;
}

.admin-logout {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  font-size: 1.4rem;
  font-family: var(--font-ui);
  font-weight: 500;
  color: #f87171;
  background: transparent;
  border: 1px solid rgba(248, 113, 113, 0.25);
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(248, 113, 113, 0.1);
  }
}

.admin-content {
  flex: 1;
  padding: 3.2rem 3.6rem;
  min-width: 0;
}
</style>
