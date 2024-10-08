import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    directory: null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    currentDirectory: (state) => state.directory,
  },
  actions: {
    async authenticate(UserKey) {
      try {
        const response = await api.post("/api/Authenticate/", { UserKey });
        this.token = response.data.access;
        localStorage.setItem("token", this.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
        // Fetch user details here if needed
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    storeDirectory(directory) {
      localStorage.setItem("directory", JSON.stringify(directory));
      this.directory = directory;
    },
    storeUser(user) {
      localStorage.setItem("user", JSON.stringify(user));
      this.user = user;
    },
    getUser() {
      try {
        const ls_User = localStorage.getItem("user");
        // console.log("getUser()", ls_User)
        if (ls_User) {
          let user = JSON.parse(ls_User);

          // Fetch user details here
          this.user = user;
          return user;
        }
      } catch (e) {
        console.log("getUser Error:", e);
      }
      return null;
    },
    logout() {
      this.token = null;
      this.user = null;
      this.directory = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("directory");
      delete api.defaults.headers.common["Authorization"];
    },
    async initialize() {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          this.token = token;
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Fetch user details here
          const user = this.getUser();
          this.user = user;
        }
      } catch (e) {
        console.log("getUser Error:", e);
      }
    },
  },
});
