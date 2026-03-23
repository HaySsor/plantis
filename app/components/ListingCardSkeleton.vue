<template>
  <div class="skeleton-card">
    <!-- top bar -->
    <div class="skel-top">
      <div class="skel skel--pill" style="width: 9rem" />
      <div class="skel skel--pill" style="width: 5rem" />
    </div>

    <!-- image -->
    <div class="skel skel--image" />

    <!-- content -->
    <div class="skel-content">
      <div class="skel skel--line" style="width: 75%" />
      <div class="skel skel--line skel--thin" style="width: 100%" />
      <div class="skel skel--line skel--thin" style="width: 60%" />

      <!-- chips -->
      <div class="skel-chips">
        <div class="skel skel--chip" style="width: 7rem" />
        <div class="skel skel--chip" style="width: 8rem" />
      </div>

      <!-- owner -->
      <div class="skel-owner">
        <div class="skel skel--avatar" />
        <div class="skel skel--line skel--thin" style="width: 8rem" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skeleton-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 2.4rem;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
  padding: 1.2rem 1.2rem 1.6rem;
  gap: 0;
}

.skel-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.2rem 1rem;
}

.skel-content {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.2rem 0.4rem 0;
}

.skel-chips {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.4rem;
}

.skel-owner {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.4rem;
}

/* ── Base skeleton ── */
.skel {
  background: linear-gradient(
    90deg,
    var(--green-soft) 25%,
    #e8ede8 50%,
    var(--green-soft) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 0.6rem;
  flex-shrink: 0;

  &--image {
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 1.6rem;
  }

  &--line {
    height: 1.6rem;
    border-radius: 0.4rem;
  }

  &--thin {
    height: 1.2rem;
    opacity: 0.7;
  }

  &--pill {
    height: 2.8rem;
    border-radius: 999px;
  }

  &--chip {
    height: 2.6rem;
    border-radius: 999px;
  }

  &--avatar {
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    flex-shrink: 0;
  }
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
</style>
