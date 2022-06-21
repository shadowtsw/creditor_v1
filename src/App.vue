<template>
  <transition name="fade-classic" mode="out-in">
    <Login v-if="!isLoggedIn" :login="login" />
    <MainApp theme="light" v-else />
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import Login from "./views/Login.vue";
import MainApp from "./views/BasicApp/MainApp.vue";
import { IndexedDBAppStateManager } from "./indexedDB/app-state-database";
import { LogMe } from "./logging/logger-function";

export default defineComponent({
  components: {
    Login,
    MainApp,
  },
  setup() {
    onMounted(async () => {
      LogMe.mount("App");
      const getTheme = await IndexedDBAppStateManager.AppStateManager.getState(
        "theme"
      );
      if (getTheme && getTheme.value && typeof getTheme.value === "string") {
        theme.value = getTheme.value;
      }
    });

    const theme = ref<string>("light");

    const isLoggedIn = ref<boolean>(false);

    const login = (arg: boolean) => {
      isLoggedIn.value = arg;
    };

    return { isLoggedIn, login };
  },
});
</script>

<style lang="scss">
/*
*Global transition classes
 */
.fade-classic-enter-active,
.fade-classic-leave-active {
  transition: opacity 0.2s ease;
}

.fade-classic-enter-from,
.fade-classic-leave-to {
  opacity: 0;
}
</style>
