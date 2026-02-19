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
  --green-dark: #315f3b;
  --text-main: #23442c;
  --text-muted: #53725b;
  --border-soft: #d7e8d9;
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
  font-family: "Avenir Next", "Segoe UI", sans-serif;
  font-size: 1.6rem;
  background:
    radial-gradient(circle at top right, #eaf8e7 0%, transparent 45%),
    linear-gradient(180deg, #fafdfa 0%, var(--bg) 100%);
  color: var(--text-main);
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

.hero {
  max-width: 1100px;
  margin: 1.4rem auto 0;
  padding: 2.2rem;
  border-radius: 24px;
  background: linear-gradient(145deg, #ffffff 0%, #f2faef 100%);
  border: 1px solid var(--border-soft);

  @media (min-width: 1001px) {
    margin-top: 2.8rem;
    padding: 3rem;
  }
}

.eyebrow {
  margin: 0;
  font-size: 1.2rem;
  color: var(--green-dark);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hero h1 {
  margin: 0.8rem 0 1rem;
  font-size: clamp(3.2rem, 6vw, 5.2rem);
  line-height: 1.1;
}

.hero p {
  margin: 0;
  max-width: 50ch;
  font-size: 2rem;
  color: var(--text-muted);
  line-height: 1.6;
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
