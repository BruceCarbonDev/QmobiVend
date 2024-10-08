<template>
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
  <div class="row justify-center items-center full-height">
    <div class="col-12 col-md-6 text-center">
      <div class="text-h6 q-mb-md">You are Logged Out</div>
      <q-btn label="Go to Login" @click="goToLogin" color="primary" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToLogin = () => {
  router.push("/Login");
};

defineOptions({
  name: "LogOut",
});
import { useAuthStore } from "src/stores/auth";
const authStore = useAuthStore();
authStore.logout();
</script>
