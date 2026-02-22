<template>
  <main class="listings-page">
    <h1>Listings</h1>
    <p>To jest przykładowa strona listings. Jeśli widzisz ten tekst, jesteś na `/listings`.</p>

    <NuxtLink to="/">Wróć na stronę główną</NuxtLink>
  </main>
</template>

<style scoped lang="scss">
.listings-page {
  padding: 2.4rem;
  border: 1px solid var(--border-soft);
  border-radius: 1.6rem;
  background: #ffffff;
}

h1 {
  margin: 0 0 1rem;
  font-size: 3rem;
  color: var(--green-dark);
}

p {
  margin: 0 0 1.6rem;
  font-size: 1.8rem;
  color: var(--text-muted);
}

a {
  display: inline-block;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--green-dark);
}
</style>
