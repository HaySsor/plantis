<template>
  <main class="home">
    <HeroSection
      badge="Dołącz do eko-rewolucji"
      title="Podaruj roślinom"
      title-highlight="drugie życie"
      description="Zielona Przesiadka to przestrzeń stworzona dla miłośników natury. Wymieniaj, oddawaj i znajduj nowe rośliny do swojej domowej dżungli w duchu zero waste."
      :show-media="true"
    >
      <template #buttons>
        <VButton :is-button="false" href="/listings" type="primary"
          >Przeglądaj rośliny</VButton
        >
        <VButton :is-button="false" href="/how-it-works" type="light"
          >Jak to działa? <Icon name="mdi:arrow-right"
        /></VButton>
      </template>
    </HeroSection>

    <HomeHowItWorks />

    <HomeCities />

    <HomeRecentListings />
  </main>
</template>

<script setup lang="ts">
const { user } = useAuth();
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding-bottom: 2rem;
}
</style>
