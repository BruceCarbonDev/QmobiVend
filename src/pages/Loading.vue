<template>
  <q-page class="flex flex-center">
    <div class="column items-center">
      <q-img
        alt="Vendy logo"
        src="images/vendy-man.png"
        style="width: 200px; height: 200px"
      />
      <q-img
        alt="Vendy logo"
        src="images/spinner.gif"
        style="width: 50px; height: 50px; margin-top: 20px"
      />
      <div class="text-h6 text-grey">{{ step }}</div>

      <div class="text-grey">{{ currentUrl }}</div>

      <!-- Directoyry Data -->
      <dataObject
        :friendlyName="'Load Directory Settings'"
        :dataObject="{
          url: 'https://directory.netvendor.co.za/directory',
          params: {
            url: currentUrl,
          },
        }"
        @onDataFetched="
          (data) => {
            storeDirectory(data);
          }
        "
      />
      <!-- User Data -->
      <dataObject
        :friendlyName="'Load User Data'"
        :dataObject="userObject"
        @onDataFetched="
          (data) => {
            storeUser(data);
          }
        "
      />
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "IndexPage",
});

import { ref } from "vue";
import { useRouter } from 'vue-router';
import dataObject from "src/components/DataComponent.vue";

const router = useRouter()

const step = ref("Loading Settings");

const userObject = ref(null);
const currentUrl =
  window.location.hostname == "localhost"
    ? "pwa-localhost"
    : window.location.hostname;

const userKey = localStorage.getItem('pwa_user_key')

const storeDirectory = (data) => {

  localStorage.setItem("pwa-directory", JSON.stringify(data));

  if (userKey) {
    //Load the User
    userObject.value = {
      url: "https://directory.netvendor.co.za/user",
      params: {
        userKey: userKey
      }
    }
  }
  else  router.push('/welcome')
};
const storeUser = (data) => {
  step.value = "Loading User";
  localStorage.setItem("pwa_user", JSON.stringify(data));
}
</script>
