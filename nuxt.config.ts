// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@nuxt/fonts", "nuxt-lottie"],
  fonts: {
    families: [
      {
        name: "Manrope",
        provider: "google",
        weights: [300, 400, 500, 600, 700],
      },
      {
        name: "Noto Serif",
        provider: "google",
        weights: [400, 600, 700, 900],
      },
      {
        name: "Cormorant Garamond",
        provider: "google",
        weights: [300, 400, 600],
      },
    ],
  },
});
