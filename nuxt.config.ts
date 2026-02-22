// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@nuxt/fonts"],
  fonts: {
    families: [
      {
        name: "Roboto",
        provider: "google",
        weights: [300, 400, 600],
      },
      {
        name: "Outfit",
        provider: "google",
        weights: [500, 600, 900],
      },
      {
        name: "Cormorant Garamond",
        provider: "google",
        weights: [300, 400, 600],
      },
    ],
  },
});
