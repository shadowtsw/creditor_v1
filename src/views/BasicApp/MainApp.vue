<template>
  <div id="creditor_app" class="container">
    <AppStateManager />
    <div class="app_menue">
      <AppMenue v-if="appIsReady" />
    </div>
    <div class="version_info">
      <VersionInfo v-if="appIsReady" />
    </div>
    <div class="nav_bar">
      <!-- <transition name="fade-classic" mode="out-in"> -->
      <NavBar v-if="appIsReady" />
      <!-- </transition> -->
    </div>
    <div class="account_window">
      <AccountList v-if="appIsReady" />
      <div v-else>creditor_v1 account-window</div>
    </div>
    <div v-if="loadedComponent" class="main_window">
      <component
        :is="loadedComponent.component"
        :key="loadedComponent.displayText"
      />
    </div>
    <div v-else>
      <p>creditor_v1 main-window</p>
    </div>
    <div class="history_list">
      <!-- <transition name="fade-classic" mode="out-in"> -->
      <HistoryList v-if="appIsReady" />
      <!-- </transition> -->
    </div>
    <div class="status_window">
      <!-- <transition name="fade-classic" mode="out-in"> -->
      <StatusWindow v-if="appIsReady" />
      <!-- </transition> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";

//Main modules
import VersionInfo from "@/components/Layout/VersionInfo.vue";
import AppMenue from "@/components/Layout/AppMenue.vue";
import HistoryList from "@/components/Layout/HistoryList.vue";
import NavBar from "@/components/Layout/NavBar.vue";
import AccountList from "@/components/Layout/AccountList.vue";
import StatusWindow from "@/components/Layout/StatusWindow.vue";
//Utilities
import { usePageNavigator, usePluginNavigator } from "@/components/navigator";
import { importPages } from "@/components/component-registration";
import Welcome from "@/views/Welcome.vue";
//Start store
import { ApplicationEnvironmentStore } from "@/store/application/application-store";
import AppStateManager from "./AppStateManager.vue";
//Logger
import { LogMe } from "@/logging/logger-function";

export default defineComponent({
  components: {
    VersionInfo,
    AppMenue,
    HistoryList,
    NavBar,
    AccountList,
    StatusWindow,
    //Pages
    Welcome,
    //StateManager
    AppStateManager,
    ...importPages(),
  },
  setup() {
    onMounted(async () => {
      LogMe.mount("MainApp");
    });
    const { currentPage, pages, settings } = usePageNavigator();

    //Main view management
    const appIsReady = computed(() => {
      return ApplicationEnvironmentStore.appReady;
    });
    //Show welcome page
    const showWelcomePage = computed(() => {
      return ApplicationEnvironmentStore.showWelcomeScreen;
    });
    //Load view
    const loadedComponent = computed(() => {
      if (showWelcomePage.value) {
        return { component: "Welcome", displayText: "Welcome" };
      }
      if (currentPage.value === "Settings") {
        return settings.value;
      }
      const targetPage = pages.value.find(
        (entry) => entry.displayText === currentPage.value
      );
      if (
        (targetPage && "active" in targetPage && !targetPage.active) ||
        !targetPage
      ) {
        //In case of stored page is not active during load or page wasn´t found
        return pages.value.find((entry) => entry.displayText === "Get Started");
      }
      return targetPage;
    });

    return {
      showWelcomePage,
      loadedComponent,
      appIsReady,
    };
  },
});
</script>
