<template>
  <AppLoader :show="!appReady" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <AppToast />
</template>

<script setup lang="ts">
const { fetchMe } = useAuth();
const appReady = ref(false);

useHead({
  style: [{ innerHTML: "body { visibility: hidden; }", id: "init-hide" }],
});

onMounted(async () => {
  document.getElementById("init-hide")?.remove();
  document.body.style.visibility = "visible";

  await Promise.all([
    fetchMe().catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 600)),
  ]);
  appReady.value = true;
});
</script>

<style lang="scss">
:root {
  --bg: ##eff1ee;
  --surface: #ffffff;
  --green-soft: #dff0e5;
  --green-main: #789880;
  --green-m-hover: #437d5a;
  --green-dark: #1e3d2f;
  --text-main: #1e3d2f;
  --text-muted: #4c644e;
  --border-soft: #a9aca9;
  --dark-text: #022110;
  --gray-text: #757875;
  --yellow-soft: #fef5d4;
  --yellow-main: #d4aa3a;
  --yellow-dark: #7a5c0a;
  --font-ui: "Manrope", "Segoe UI", sans-serif;
  --font-title: "Noto Serif", Georgia, serif;
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
  background: var(--bg);
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
