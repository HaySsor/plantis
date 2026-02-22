<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
:root {
  --bg: #f7fbf6;
  --surface: #ffffff;
  --green-soft: #d9f0d7;
  --green-main: #7bbf8a;
  --green-main-hover: #6bb07a;
  --green-dark: #315f3b;
  --text-main: #23442c;
  --text-muted: #53725b;
  --border-soft: #d7e8d9;
  --dark-text: #1b2f1e;
  --gray-text: #828181;
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
  background:
    radial-gradient(circle at top right, #eaf8e7 0%, transparent 45%),
    linear-gradient(180deg, #fafdfa 0%, var(--bg) 100%);
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
