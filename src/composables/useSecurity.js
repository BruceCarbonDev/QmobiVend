import { useAuthStore } from "src/stores/auth";
import { useRouter } from 'vue-router'

const authStore = useAuthStore();
export function useSecurity() {

  const router = useRouter();
  const isAuthenticated = authStore.isAuthenticated;

  const user = authStore.getUser();

  const authCheck = () => {
    if (authStore.isAuthenticated) console.log("authCheck OK");
    else {
      authStore.logout();
      router.push("/login");
    }
  };

  const logout = () => {
    authStore.logout();
    router.push("/login");
  };

  return { isAuthenticated, user, authCheck,logout };
}
