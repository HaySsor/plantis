<template>
  <div v-if="chips.length" class="attr-chips" :class="`attr-chips--${variant}`">
    <div
      v-for="chip in chips"
      :key="chip.key"
      class="attr-chip"
      :class="chip.class"
    >
      <Icon :name="chip.icon" class="attr-icon" />
      <span class="attr-value">{{ chip.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    watering?: string | null;
    light?: string | null;
    position?: string | null;
    height?: string | null;
    difficulty?: string | null;
    petFriendly?: boolean | null;
    variant?: "full" | "compact";
    limit?: number;
  }>(),
  {
    variant: "full",
    limit: 99,
  },
);

const WATERING: Record<string, { icon: string; label: string }> = {
  LOW: { icon: "mdi:water-off", label: "Sucholubne" },
  MEDIUM: { icon: "mdi:water", label: "Umiarkowane" },
  HIGH: { icon: "mdi:water-plus", label: "Wilgociolubne" },
};

const LIGHT: Record<string, { icon: string; label: string }> = {
  LOW: { icon: "mdi:weather-night", label: "Cieniolubne" },
  MEDIUM: { icon: "mdi:weather-partly-cloudy", label: "Półcień" },
  HIGH: { icon: "mdi:weather-sunny", label: "Jasne stanowisko" },
  FULL_SUN: { icon: "mdi:white-balance-sunny", label: "Pełne słońce" },
};

const POSITION: Record<string, { icon: string; label: string }> = {
  INDOOR: { icon: "mdi:home-outline", label: "Domowe" },
  OUTDOOR: { icon: "mdi:tree-outline", label: "Zewnętrzne" },
  BOTH: { icon: "mdi:home-variant-outline", label: "Domowe / Zewnętrzne" },
};

const HEIGHT: Record<string, { label: string }> = {
  SMALL: { label: "do 30 cm" },
  MEDIUM: { label: "30–80 cm" },
  LARGE: { label: "powyżej 80 cm" },
};

const DIFFICULTY: Record<string, { icon: string; label: string }> = {
  EASY: { icon: "mdi:emoticon-happy-outline", label: "Łatwa" },
  MEDIUM: { icon: "mdi:emoticon-neutral-outline", label: "Średnia" },
  HARD: { icon: "mdi:emoticon-sad-outline", label: "Trudna" },
};

const chips = computed(() => {
  const result: { key: string; icon: string; label: string; class?: string }[] =
    [];

  if (props.watering && WATERING[props.watering])
    result.push({ key: "watering", ...WATERING[props.watering] });

  if (props.light && LIGHT[props.light])
    result.push({ key: "light", ...LIGHT[props.light] });

  if (props.position && POSITION[props.position])
    result.push({ key: "position", ...POSITION[props.position] });

  if (props.height && HEIGHT[props.height])
    result.push({
      key: "height",
      icon: "mdi:arrow-expand-vertical",
      ...HEIGHT[props.height],
    });

  if (props.difficulty && DIFFICULTY[props.difficulty])
    result.push({ key: "difficulty", ...DIFFICULTY[props.difficulty] });

  if (props.petFriendly !== null && props.petFriendly !== undefined)
    result.push({
      key: "pet",
      icon: props.petFriendly ? "mdi:paw" : "mdi:paw-off",
      label: props.petFriendly ? "Przyjazne" : "Nieprzyjazne",
      class: props.petFriendly ? "attr-chip--pet-yes" : "attr-chip--pet-no",
    });

  return result.slice(0, props.limit);
});
</script>

<style lang="scss" scoped>
.attr-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.attr-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  font-weight: 500;
  white-space: nowrap;
}

/* ── Full (strona szczegółowa) ── */
.attr-chips--full .attr-chip {
  padding: 0.8rem 1.2rem 0.8rem 0.8rem;
  background: var(--green-soft);
  color: var(--green-dark);
  font-size: 1.4rem;
}

.attr-chips--full .attr-chip--pet-yes {
  background: #e8f5e9;
  color: #2e7d32;
}

.attr-chips--full .attr-chip--pet-no {
  background: #fce4ec;
  color: #c62828;
}

.attr-chips--full .attr-icon {
  font-size: 1.8rem;
}

/* ── Compact (karta ogłoszenia) ── */
.attr-chips--compact {
  gap: 0.5rem;
  justify-content: center;
}

.attr-chips--compact .attr-chip {
  padding: 0.4rem 0.9rem 0.4rem 0.6rem;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(4px);
  color: var(--green-dark);
  font-size: 1.2rem;
}

.attr-chips--compact .attr-icon {
  font-size: 1.4rem;
}
</style>
