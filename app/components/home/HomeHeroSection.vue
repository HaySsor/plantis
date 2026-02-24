<template>
  <section class="hero-container">
    <Badge
      color="#d9f0d7"
      text-color="#7bbf8a"
      :is-uppercase="true"
      icon="mdi-leaf"
      >Dołącz do eko-rewolucji</Badge
    >
    <div class="hero-grid">
      <div class="hero-box">
        <h1>
          Podaruj roślinom

          <span> drugie życie</span>
        </h1>

        <p class="description">
          Zielona Przesiadka to przestrzeń stworzona dla miłośników natury.
          Wymieniaj, oddawaj i znajduj nowe rośliny do swojej domowej dżungli w
          duchu zero waste.
        </p>

        <div class="buttons">
          <VButton :is-button="true" type="primary">Przeglądaj rośliny</VButton>
          <VButton :is-button="true" type="light"
            >Jak to działa? <Icon name="mdi:arrow-right" class="button-icon"
          /></VButton>
        </div>
      </div>

      <div class="lottie-box">
        <Lottie
          link="/hero.json"
          background-color="transparent"
          :width="600"
          :height="600"
          :speed="1"
          :loop="true"
          :autoplay="true"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

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
}

.hero-search {
  width: 100%;
  margin-top: 3.6rem;
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
  display: none;

  @media (min-width: 1200px) {
    display: block;
  }
}

.hero-box {
  margin-top: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
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
  letter-spacing: 0px;
  @media (min-width: 768px) {
    font-size: 2rem;
    line-height: 28px;
  }
}

.buttons {
  display: flex;
  flex-direction: row;
  gap: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
}
</style>
