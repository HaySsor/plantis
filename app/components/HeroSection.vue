<template>
  <section
    class="hero-container"
    :class="[{ 'is-centered': !showMedia }, customClass]"
  >
    <Badge
      v-if="badge"
      color="#d9f0d7"
      text-color="#7bbf8a"
      :is-uppercase="true"
      icon="mdi-leaf"
      >{{ badge }}</Badge
    >

    <div class="hero-grid">
      <div class="hero-box">
        <h1>
          {{ title }}
          <span v-if="titleHighlight">{{ titleHighlight }}</span>
        </h1>

        <p v-if="description" class="description">{{ description }}</p>

        <div v-if="$slots.buttons" class="buttons">
          <slot name="buttons" />
        </div>
      </div>

      <div v-if="showMedia" class="lottie-box">
        <Lottie
          link="/hero.json"
          background-color="transparent"
          :speed="0.6"
          :loop="true"
          :autoplay="true"
          direction="alternate"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    badge?: string;
    title: string;
    titleHighlight?: string;
    description?: string;
    showMedia?: boolean;
    customClass?: string;
  }>(),
  {
    showMedia: true,
  },
);
</script>

<style lang="scss" scoped>
.hero-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: calc(100svh - 68px - 80px);
  padding-block: 30px;
  position: relative;

  @media (min-width: 1200px) {
    min-height: calc(100svh - 100px);
  }

  &.is-centered {
    min-height: auto;
    padding-block: 6rem;

    .hero-box {
      align-items: center;
      text-align: center;
    }

    .description {
      text-align: center;
    }

    .hero-grid {
      display: flex;
      justify-content: center;
    }
  }
}

.hero-grid {
  @media (min-width: 1200px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    justify-items: center;
    align-items: center;
  }
}

.lottie-box {
  display: block;
}

.hero-box {
  margin-top: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  .is-centered & {
    margin-top: 0;
  }
}

.hero-container h1 {
  font-size: 5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  font-weight: 600;
  font-family: var(--font-title);
  letter-spacing: -0.04em;
  line-height: 52px;
  color: var(--dark-text);

  span {
    display: block;
    position: relative;
    color: var(--green-main);
  }

  @media (min-width: 768px) {
    font-size: 7.2rem;
    line-height: 82px;
  }
}

.description {
  font-size: 1.6rem;
  color: var(--gray-text);
  text-align: center;
  max-width: 661px;
  line-height: 20px;

  @media (min-width: 768px) {
    font-size: 2rem;
    line-height: 28px;
  }
}

.buttons {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
</style>
