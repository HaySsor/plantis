export function useFavorites() {
  const { user } = useAuth();
  const router = useRouter();

  const ids = useState<string[]>("favorites", () => []);
  const loaded = useState<boolean>("favorites-loaded", () => false);

  async function fetchFavorites() {
    if (!user.value || loaded.value) return;
    try {
      const data = await $fetch<{ ids: string[] }>("/api/favorites");
      ids.value = data.ids;
      loaded.value = true;
    } catch {}
  }

  function isFavorite(id: string) {
    return ids.value.includes(id);
  }

  async function toggle(id: string) {
    if (!user.value) {
      router.push("/auth/login");
      return;
    }

    const wasFav = isFavorite(id);
    if (wasFav) {
      ids.value = ids.value.filter((i) => i !== id);
    } else {
      ids.value = [...ids.value, id];
    }

    try {
      await $fetch("/api/favorites/toggle", {
        method: "POST",
        body: { listingId: id },
      });
    } catch {
      if (wasFav) {
        ids.value = [...ids.value, id];
      } else {
        ids.value = ids.value.filter((i) => i !== id);
      }
    }
  }

  return { ids, isFavorite, toggle, fetchFavorites };
}
