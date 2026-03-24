<template>
  <section class="how-section">
    <div class="how-header">
      <h2>Jak to działa?</h2>
      <p>Trzy kroki dzielą Cię od nowej rośliny.</p>
    </div>

    <div class="steps-grid">
      <StepCard
        icon="mdi:camera"
        badge-icon="mdi:sprout"
        title="Dodaj ogłoszenie"
        description="Zrób zdjęcie, opisz roślinę i wybierz formę odbioru. Zajmuje to mniej niż minutę."
      />
      <StepCard
        icon="mdi:message-text-outline"
        badge-icon="mdi:leaf"
        title="Skontaktuj się"
        description="Napisz do ogłoszeniodawcy i umówcie szczegóły. Cały proces jest bezpłatny."
      />
      <StepCard
        icon="mdi:hand-heart-outline"
        badge-icon="mdi:flower"
        title="Odbierz roślinę"
        description="Spotkajcie się lub wyślij pocztą. Roślina trafia w dobre ręce, nie do kosza."
      />
    </div>

    <div class="how-cta">
      <NuxtLink to="/how-it-works" class="how-link">
        Dowiedz się więcej <Icon name="mdi:arrow-right" />
      </NuxtLink>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.how-section {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 2rem;
  background-color: #eff1ee;
  border-radius: 20px;
}

.how-header {
  text-align: center;

  h2 {
    font-size: 2.8rem;
    font-family: var(--font-title);
    color: var(--green-dark);
    margin: 0 0 0.6rem;
  }

  p {
    font-size: 1.6rem;
    color: var(--text-main);
    margin: 0;
  }
}

.steps-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.6rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.how-cta {
  display: flex;
  justify-content: center;
}

.how-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--green-dark);
  text-decoration: none;
  transition: gap 0.15s;

  &:hover {
    gap: 0.8rem;
  }
}
</style>
