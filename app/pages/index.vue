<template>
  <main>
    <HomeHeroSection />
    <ListingSearchBar
      class="hero-search"
      :navigate-on-submit="true"
      :navigate-to-path="'/listings'"
    />
  </main>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
