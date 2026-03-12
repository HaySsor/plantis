<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <AppToast />
</template>

<style lang="scss">
:root {
  --bg: #f4f6f2;
  --surface: #ffffff;
  --green-soft: #e5ebe0;
  --green-main: #78a87e;
  --green-m-hover: #68987e;
  --green-dark: #2e5235;
  --text-main: #283530;
  --text-muted: #607868;
  --border-soft: #d5e2d8;
  --dark-text: #1a2e20;
  --gray-text: #8a9490;
  --yellow-soft: #fef5d4;
  --yellow-main: #d4aa3a;
  --yellow-dark: #7a5c0a;
  --font-ui: "Roboto", "Segoe UI", sans-serif;
  --font-title: "Outfit", "Segoe UI", sans-serif;
  --font-quote: "Cormorant Garamond", Georgia, serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 62.5%;
}

body {
  margin: 0;
  font-family: var(--font-ui);
  font-size: 1.6rem;
  background: #f4f6f2;
  color: var(--text-main);
}

.font-quote {
  font-family: var(--font-quote);
}

:where(h1, h2, h3, h4, h5, h6) {
  font-family: var(--font-title);
}

a {
  color: inherit;
  text-decoration: none;
}

.page {
  min-height: 100vh;
  padding: 1.25rem;
  padding-bottom: 6.8rem;

  @media (min-width: 1001px) {
    padding-bottom: 1.25rem;
  }
}
</style>
