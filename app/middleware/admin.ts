export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchMe } = useAuth();

  if (!user.value) {
    await fetchMe().catch(() => {});
  }

  if (!user.value || user.value.role !== "ADMIN") {
    return navigateTo("/zaplecze/login");
  }
});
