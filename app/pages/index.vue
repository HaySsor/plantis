<template>
  <main>
    <HeroSection
      badge="Dołącz do eko-rewolucji"
      title="Podaruj roślinom"
      title-highlight="drugie życie"
      description="Zielona Przesiadka to przestrzeń stworzona dla miłośników natury. Wymieniaj, oddawaj i znajduj nowe rośliny do swojej domowej dżungli w duchu zero waste."
      :show-media="true"
    >
      <template #buttons>
        <VButton :is-button="false" href="/listings" type="primary">Przeglądaj rośliny</VButton>
        <VButton :is-button="true" type="light">Jak to działa? <Icon name="mdi:arrow-right" /></VButton>
      </template>
    </HeroSection>
    <ListingSearchBar
      class="hero-search"
      :navigate-on-submit="true"
      :navigate-to-path="'/listings'"
    />
    <HomeRecentListings />
  </main>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
