<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" /> -->

        <q-toolbar-title>
          <div class="row justify-center text-h4 q-ma-md">
            <!-- <q-avatar>
              <img alt="Vendy logo" src="images/vendy-logo.png" />
            </q-avatar>
            <q-divider /> -->
            Vendy Mobi App
          </div>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left" v-if="isAuthenticated">
        <q-route-tab to="/page1" label="Home" />
        <q-route-tab to="/page2" label="My Meters" />
        <q-route-tab to="/page3" label="My Details" />
      </q-tabs>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      bordered
    >
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <div class="full-width row justify-center">
          <q-tabs>
            <q-route-tab to="/Help" label="Help" />
            <q-route-tab v-if="isAuthenticated" to="/AddMeter" label="Add a Meter" />
          </q-tabs>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from 'src/stores/auth'
const leftDrawerOpen = ref(false);
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>
