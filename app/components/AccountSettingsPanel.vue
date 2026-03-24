<template>
  <div class="settings-panel">
    <div class="panel-viewport">
      <Transition :name="direction === 'forward' ? 'push-forward' : 'push-back'">

        <!-- Settings list -->
        <div v-if="!activeSection" key="__list__" class="panel-slide">

          <!-- User header -->
          <div class="user-header">
            <div class="user-avatar">{{ userInitial }}</div>
            <div class="user-info">
              <span class="user-name">{{ user?.name }}</span>
              <span class="user-email">{{ user?.email }}</span>
            </div>
          </div>

          <!-- Settings items (from prop) -->
          <div class="settings-group">
            <button
              v-for="item in items"
              :key="item.key"
              class="settings-row"
              @click="navigate(item.key)"
            >
              <span class="row-icon" :style="{ background: item.color }">
                <Icon :name="item.icon" />
              </span>
              <span class="row-label">{{ item.label }}</span>
              <Icon name="mdi:chevron-right" class="row-chevron" />
            </button>
          </div>

          <!-- Links group (rendered internally so styles work) -->
          <div v-if="links?.length" class="settings-group">
            <NuxtLink
              v-for="link in links"
              :key="link.key"
              :to="link.href!"
              class="settings-row"
            >
              <span class="row-icon" :style="{ background: link.color }">
                <Icon :name="link.icon" />
              </span>
              <span class="row-label">{{ link.label }}</span>
              <Icon name="mdi:chevron-right" class="row-chevron" />
            </NuxtLink>
          </div>

        </div>

        <!-- Section view -->
        <div v-else :key="activeSection" class="panel-slide section-slide">
          <button class="back-btn" @click="goBack">
            <Icon name="mdi:chevron-left" />
            Ustawienia
          </button>
          <slot :name="activeSection">
            <div class="section-placeholder">
              <h2 class="section-title">{{ activeLabel }}</h2>
              <p class="section-soon">Wkrótce dostępne</p>
            </div>
          </slot>
        </div>

      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface SettingsItem {
  key: string;
  label: string;
  icon: string;
  color: string;
  href?: string;
}

const props = defineProps<{
  items: SettingsItem[];
  links?: SettingsItem[];
}>();
const emit = defineEmits<{ logout: [] }>();

const { user } = useAuth();

const activeSection = ref<string | null>(null);
const direction = ref<"forward" | "back">("forward");

const userInitial = computed(() => (user.value?.name?.charAt(0) ?? "U").toUpperCase());
const activeLabel = computed(() => props.items.find(i => i.key === activeSection.value)?.label ?? "");

function navigate(key: string) {
  direction.value = "forward";
  activeSection.value = key;
}

function goBack() {
  direction.value = "back";
  activeSection.value = null;
}

defineExpose({ navigate });
</script>

<style lang="scss" scoped>
.settings-panel {
  background: var(--surface);
  border-radius: 2.4rem;
  border: 1px solid var(--border-soft);
  overflow: hidden;
}

.panel-viewport {
  position: relative;
  overflow: hidden;
  min-height: 52rem;
}

.panel-slide {
  width: 100%;
  padding: 0.8rem 0 1.6rem;
}

/* ── User header ── */
.user-header {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  padding: 1.6rem;
  border-bottom: 1px solid var(--border-soft);
  margin-bottom: 1.2rem;
}

.user-avatar {
  width: 5.6rem;
  height: 5.6rem;
  border-radius: 50%;
  background: var(--green-soft);
  color: var(--green-dark);
  font-size: 2.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.user-name {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--text-main);
  font-family: var(--font-title);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 1.3rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Groups ── */
.settings-group {
  margin: 0 1.2rem 0.8rem;
  border-radius: 1.4rem;
  overflow: hidden;
  border: 1px solid var(--border-soft);
  background: var(--bg);
}

.settings-row {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  width: 100%;
  padding: 1.1rem 1.4rem;
  border: none;
  background: transparent;
  cursor: pointer;
  text-decoration: none;
  color: var(--text-main);
  font-size: 1.5rem;
  font-family: var(--font-ui);
  transition: background 0.12s;

  & + & { border-top: 1px solid var(--border-soft); }

  &:hover  { background: var(--green-soft); }
  &:active { background: #c5e8c8; }
}

.row-icon {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.9rem;
  color: #fff;
  flex-shrink: 0;
}

.row-label {
  flex: 1;
  text-align: left;
  font-weight: 500;
}

.row-chevron {
  font-size: 1.8rem;
  color: var(--text-muted);
  opacity: 0.5;
  flex-shrink: 0;
}

/* ── Logout ── */
.logout-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: calc(100% - 2.4rem);
  margin: 0.4rem 1.2rem 0.8rem;
  padding: 1.1rem;
  border-radius: 1.4rem;
  border: 1px solid #fca5a5;
  background: transparent;
  color: #b91c1c;
  font-size: 1.5rem;
  font-family: var(--font-ui);
  font-weight: 500;
  cursor: pointer;
  transition: background 0.12s;

  &:hover { background: #fef2f2; }
}

/* ── Section view ── */
.section-slide { padding: 1.2rem 0 2.4rem; }

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.8rem 1.4rem;
  background: none;
  border: none;
  color: var(--green-main);
  font-size: 1.5rem;
  font-family: var(--font-ui);
  font-weight: 500;
  cursor: pointer;
  border-radius: 0.8rem;
  transition: color 0.12s;

  &:hover { color: var(--green-dark); }
}

.section-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 6rem 2rem;
  text-align: center;
}

.section-title {
  font-family: var(--font-title);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--green-dark);
  margin: 0;
}

.section-soon {
  font-size: 1.5rem;
  color: var(--text-muted);
}

/* ── Transitions ── */
.push-forward-enter-active,
.push-forward-leave-active,
.push-back-enter-active,
.push-back-leave-active {
  transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.32s;
  position: absolute !important;
  top: 0; left: 0; width: 100%;
}

.push-forward-enter-from { transform: translateX(100%);  opacity: 0.6; }
.push-forward-enter-to   { transform: translateX(0);     opacity: 1;   }
.push-forward-leave-from { transform: translateX(0);     opacity: 1;   }
.push-forward-leave-to   { transform: translateX(-30%);  opacity: 0;   }

.push-back-enter-from { transform: translateX(-30%); opacity: 0;   }
.push-back-enter-to   { transform: translateX(0);    opacity: 1;   }
.push-back-leave-from { transform: translateX(0);    opacity: 1;   }
.push-back-leave-to   { transform: translateX(100%); opacity: 0.6; }
</style>
