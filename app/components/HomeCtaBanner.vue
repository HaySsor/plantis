<template>
  <section class="cta-banner">
    <div class="cta-content">
      <Icon name="mdi:sprout" class="cta-icon" />
      <div class="cta-text">
        <h3>Masz roślinę do oddania?</h3>
        <p>Dodaj ogłoszenie za darmo i znajdź nowego opiekuna w swojej okolicy.</p>
      </div>
    </div>
    <VButton :is-button="false" href="/listings/add" type="primary">
      Dodaj ogłoszenie <Icon name="mdi:arrow-right" />
    </VButton>
  </section>
</template>

<style lang="scss" scoped>
.cta-banner {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
  background: var(--green-dark);
  border-radius: 2rem;
  padding: 2.8rem 2.4rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;
  }
}

.cta-content {
  display: flex;
  align-items: flex-start;
  gap: 1.6rem;
}

.cta-icon {
  font-size: 3.6rem;
  color: var(--green-soft);
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.cta-text {
  h3 {
    font-size: 2rem;
    font-family: var(--font-title);
    color: #fff;
    margin: 0 0 0.4rem;
    font-weight: 700;
  }

  p {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    line-height: 1.5;
  }
}

:deep(.v-button) {
  white-space: nowrap;
  flex-shrink: 0;
  background: var(--green-soft) !important;
  color: var(--green-dark) !important;

  &:hover {
    background: #fff !important;
  }
}
</style>
