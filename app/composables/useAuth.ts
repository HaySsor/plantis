type AuthUser = { id: string; email: string; name: string | null } | null;

export function useAuth() {
  const user = useState<AuthUser>("auth:user", () => null);
  const loading = useState<boolean>("auth:loading", () => false);

  async function fetchMe() {
    loading.value = true;
    try {
      const res = await $fetch<{ user: AuthUser }>("/api/auth/me");
      user.value = res.user;
    } finally {
      loading.value = false;
    }
  }

  async function login(email: string, password: string) {
    loading.value = true;
    try {
      await $fetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      await fetchMe();
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  return { user, loading, fetchMe, login, logout };
}
