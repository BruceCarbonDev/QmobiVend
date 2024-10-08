<template>
  <q-page class="column items-center">
    <h4 class="text-secondary text-bold q-mt-xl q-mt-md">Welcome</h4>
    <div class="column items-center q-gutter-y-md flex-grow justify-center">
      <q-img
        alt="Vendy logo"
        src="images/vendy-man.png"
        style="width: 150px; height: 150px; padding: 0"
      />
      <q-card flat bordered v-if="user" class="q-ma-md">
        <q-card-section class="q-gutter-md">
          <div class="text-center">
            <div><b>User Name:</b> {{ user.userName }}</div>
            <div><b>Email:</b> {{ user.email }}</div>
            <div><b>Mobile Number:</b> {{ user.mobile }}</div>
          </div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <div class="row justify-center q-gutter-sm items-center full-height">
            <q-btn
              style="width: 200px"
              color="primary"
              to="/MyMeters"
              icon="gas_meter"
              label="My Meters"
            /><br />
            <q-btn
              style="width: 200px"
              outline
              color="secondary"
              to="/Logout"
              icon="logout"
              label="Log me out"
            />
          </div>
        </q-card-section>
      </q-card>

      <div v-else class="row justify-center q-gutter-sm items-center">
        <q-btn
          style="width: 200px"
          color="primary"
          to="/Register"
          icon="person_add"
          label="I Am new"
        />
        <q-btn
          style="width: 200px"
          color="secondary"
          to="/Login"
          icon="login"
          label="Login"
        />
      </div>
    </div>
    <!-- {{ user }} -->
  </q-page>
</template>
<script setup>
defineOptions({
  name: "WelcomePage",
});
import { onMounted, ref } from "vue";
import { useAuthStore } from "src/stores/auth";
const authStore = useAuthStore();

const user = ref(null);
onMounted(() => {
  user.value = authStore.getUser();
  console.log("user", user.value);
  if (user.value) {
    // router.push("/");
  }
});
</script>
