<template>
  <div class="filter-sidebar">
    <div class="sidebar-section">
      <span class="sidebar-label">Podlewanie</span>
      <div class="sidebar-chips">
        <button
          v-for="opt in wateringOptions"
          :key="opt.value"
          class="type-chip"
          :class="{ active: activeWatering === opt.value }"
          @click="$emit('toggle', 'watering', opt.value)"
        >
          <Icon :name="opt.icon" />
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="sidebar-section">
      <span class="sidebar-label">Światło</span>
      <div class="sidebar-chips">
        <button
          v-for="opt in lightOptions"
          :key="opt.value"
          class="type-chip"
          :class="{ active: activeLight === opt.value }"
          @click="$emit('toggle', 'light', opt.value)"
        >
          <Icon :name="opt.icon" />
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="sidebar-section">
      <span class="sidebar-label">Stanowisko</span>
      <div class="sidebar-chips">
        <button
          v-for="opt in positionOptions"
          :key="opt.value"
          class="type-chip"
          :class="{ active: activePosition === opt.value }"
          @click="$emit('toggle', 'position', opt.value)"
        >
          <Icon :name="opt.icon" />
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="sidebar-section">
      <span class="sidebar-label">Wysokość</span>
      <div class="sidebar-chips">
        <button
          v-for="opt in heightOptions"
          :key="opt.value"
          class="type-chip"
          :class="{ active: activeHeight === opt.value }"
          @click="$emit('toggle', 'height', opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="sidebar-section">
      <span class="sidebar-label">Trudność</span>
      <div class="sidebar-chips">
        <button
          v-for="opt in difficultyOptions"
          :key="opt.value"
          class="type-chip"
          :class="{ active: activeDifficulty === opt.value }"
          @click="$emit('toggle', 'difficulty', opt.value)"
        >
          <Icon :name="opt.icon" />
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="sidebar-section">
      <span class="sidebar-label">Zwierzęta</span>
      <div class="sidebar-chips">
        <button
          class="type-chip"
          :class="{ active: activePetFriendly === 'true' }"
          @click="$emit('toggle', 'petFriendly', 'true')"
        >
          <Icon name="mdi:paw" /> Przyjazne
        </button>
        <button
          class="type-chip"
          :class="{ active: activePetFriendly === 'false' }"
          @click="$emit('toggle', 'petFriendly', 'false')"
        >
          <Icon name="mdi:paw-off" /> Nieprzyjazne
        </button>
      </div>
    </div>

    <button v-if="hasFilters" class="clear-btn" @click="$emit('clear')">
      <Icon name="mdi:close" />
      Wyczyść filtry
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeWatering: string;
  activeLight: string;
  activePosition: string;
  activeHeight: string;
  activeDifficulty: string;
  activePetFriendly: string;
  hasFilters: boolean;
}>();

defineEmits<{
  toggle: [key: string, value: string];
  clear: [];
}>();

const wateringOptions = [
  { value: "LOW", label: "Sucholubne", icon: "mdi:water-off" },
  { value: "MEDIUM", label: "Umiarkowane", icon: "mdi:water" },
  { value: "HIGH", label: "Wilgociolubne", icon: "mdi:water-plus" },
];

const lightOptions = [
  { value: "LOW", label: "Cieniolubne", icon: "mdi:weather-night" },
  { value: "MEDIUM", label: "Półcień", icon: "mdi:weather-partly-cloudy" },
  { value: "HIGH", label: "Jasne", icon: "mdi:weather-sunny" },
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
  { value: "LARGE", label: "pow. 80 cm" },
];

const difficultyOptions = [
  { value: "EASY", label: "Łatwa", icon: "mdi:emoticon-happy-outline" },
  { value: "MEDIUM", label: "Średnia", icon: "mdi:emoticon-neutral-outline" },
  { value: "HARD", label: "Trudna", icon: "mdi:emoticon-sad-outline" },
];
</script>

<style lang="scss" scoped>
.filter-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid var(--border-soft);

  &:last-of-type {
    border-bottom: none;
  }
}

.sidebar-label {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.sidebar-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 10rem;
  border: 2px solid var(--border-soft);
  background: var(--surface);
  font-size: 1.3rem;
  font-family: var(--font-ui);
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;

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

.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.8rem;
  padding: 0.7rem 1.2rem;
  border-radius: 10rem;
  border: 1.5px solid #fca5a5;
  background: transparent;
  font-size: 1.3rem;
  font-family: var(--font-ui);
  font-weight: 500;
  color: #b91c1c;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #fef2f2;
  }
}
</style>
