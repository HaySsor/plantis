<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <Icon name="mdi:leaf" class="footer-logo-icon" />
            <span>Zielona Przesiadka</span>
          </div>
          <p class="footer-tagline">
            Tworzymy społeczność pasjonatów, którzy wierzą, że każda roślina
            zasługuje na drugą szansę i kochający dom.
          </p>
          <div class="footer-socials">
            <a href="#" aria-label="Instagram" class="social-btn">
              <Icon name="mdi:camera-iris" />
            </a>
            <a href="#" aria-label="Udostępnij" class="social-btn">
              <Icon name="mdi:share-variant" />
            </a>
            <a href="#" aria-label="Ulubione" class="social-btn">
              <Icon name="mdi:heart" />
            </a>
          </div>
        </div>

        <div class="footer-col">
          <h4>O nas</h4>
          <ul>
            <li><NuxtLink to="/how-it-works">Jak to działa</NuxtLink></li>
            <li><a href="#">Kontakt</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Pomoc</h4>
          <ul>
            <li><a href="#">Bezpieczne wymiany</a></li>
            <li><a href="#">Zgłoś problem</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div class="footer-newsletter">
          <h4>Bądź na bieżąco</h4>
          <p>
            Zapisz się do newslettera i otrzymuj powiadomienia o nowych rzadkich
            okazach.
          </p>
          <div class="newsletter-form">
            <input
              type="email"
              placeholder="Twój e-mail"
              class="newsletter-input"
            />
            <button type="button" class="newsletter-btn">Subskrybuj</button>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2024 Zielona Przesiadka. Wszystkie prawa zastrzeżone.</span>
        <div class="footer-legal">
          <a href="#">Regulamin</a>
          <a href="#">Polityka prywatności</a>
          <a href="#">Legalne</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.footer {
  background: #1a2e1f;
  color: #c8dac9;
  margin-top: 6rem;
}

.footer-inner {
  max-width: 1300px;
  margin: 0 auto;
  padding: 5rem 2.4rem 2.4rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 5rem;
  }
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  font-family: var(--font-title);
}

.footer-logo-icon {
  font-size: 2.2rem;
  color: #5db870;
}

.footer-tagline {
  font-size: 1.4rem;
  line-height: 22px;
  color: #8aab8e;
  max-width: 280px;
}

.footer-socials {
  display: flex;
  gap: 1rem;
}

.social-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #253d2a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c8dac9;
  font-size: 1.8rem;
  transition: background 0.2s ease;

  &:hover {
    background: #2f4d35;
  }
}

.footer-col {
  h4 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 1.6rem;
    letter-spacing: 0.02em;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  a {
    font-size: 1.4rem;
    color: #8aab8e;
    transition: color 0.2s ease;

    &:hover {
      color: #fff;
    }
  }
}

.footer-newsletter {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  h4 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.02em;
  }

  p {
    font-size: 1.4rem;
    color: #8aab8e;
    line-height: 22px;
  }
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.4rem;
}

.newsletter-input {
  background: #253d2a;
  border: 1px solid #2f4d35;
  border-radius: 999px;
  padding: 1rem 1.6rem;
  font-size: 1.4rem;
  color: #fff;
  outline: none;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: #5a7a5e;
  }

  &:focus {
    border-color: #5db870;
  }
}

.newsletter-btn {
  background: #5db870;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 1.1rem 2rem;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #4da860;
  }
}

.footer-bottom {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #253d2a;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  font-size: 1.3rem;
  color: #5a7a5e;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.footer-legal {
  display: flex;
  gap: 2rem;

  a {
    color: #5a7a5e;
    font-size: 1.3rem;
    transition: color 0.2s ease;

    &:hover {
      color: #c8dac9;
    }
  }
}
</style>
