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
          <span>drugie życie</span>
        </h1>

        <p class="description">
          Zielona Przesiadka to przestrzeń stworzona dla miłośników natury.
          Wymieniaj, oddawaj i znajduj nowe rośliny do swojej domowej dżungli w
          duchu zero waste.
        </p>

        <div class="buttons"></div>
      </div>

      <div class="lottie-box">
        <Lottie
          link="/hero"
          background-color="transparent"
          :width="600"
          :height="600"
          :speed="1"
          :loop="false"
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
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  min-height: calc(100svh - 68px - 80px);
  padding-block: 30px;
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

.cta {
  margin-top: 1.5rem;
  display: inline-block;
  background: var(--green-main);
  color: #ffffff;
  font-size: 1.9rem;
  font-weight: 600;
  padding: 1.15rem 2rem;
  border-radius: 12px;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.cta:hover {
  transform: translateY(-1px);
  background: #6daf7d;
}
</style>
