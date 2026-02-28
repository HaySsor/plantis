<template>
  <main>
    <HeroSection
      badge="Zielona wymiana"
      title="Rośliny nie trafiają"
      title-highlight="do kosza"
      description="Trzy kroki. Jedna roślina. Nowy właściciel i mniej zmarnowanej zieleni."
      :show-media="false"
      custom-class="how-it-works-hero"
    />
    <section class="steps">
      <StepCard
        icon="mdi:camera"
        badge-icon="mdi:sprout"
        title="Dodaj ogłoszenie"
        description="Zrób wyraźne zdjęcie swojej rośliny i napisz kilka zdań o jej stanie oraz potrzebach. Im więcej informacji podasz, tym łatwiej znajdzie nowy dom."
      />
      <StepCard
        icon="mdi:message-text-outline"
        badge-icon="mdi:leaf"
        title="Znajdź nowego opiekuna"
        description="Odpowiadaj na wiadomości i wybierz osobę, która najlepiej zadba o Twoją roślinę. Wymiana odbywa się bezpłatnie — liczy się dobra energia i odpowiedzialność."
      />
      <StepCard
        icon="mdi:hand-heart-outline"
        badge-icon="mdi:flower"
        title="Przekaż roślinę"
        description="Umów dogodny termin odbioru i przekaż roślinę w dobre ręce. Twoja zielona podopieczna zacznie nowy rozdział, a Ty zrobisz miejsce na kolejne roślinne historie."
      />
    </section>
    <div class="cta">
      <VButton :is-button="false" :href="user ? '/listings/add' : '/auth/login'" type="primary">
        Zacznij teraz <Icon name="mdi:arrow-right" />
      </VButton>
    </div>
  </main>
</template>

<script setup lang="ts">
const { user } = useAuth();
</script>

<style lang="scss" scoped>
:deep(.hero-grid) {
  margin-top: 30px;
}

.steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 0 1.6rem 6rem;
  max-width: 1000px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    padding: 0 2.4rem 4rem;
  }
}

.cta {
  display: flex;
  justify-content: center;
  padding-bottom: 8rem;
}
</style>
