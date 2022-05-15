<template>
  <div id="creditor_app" class="container">
    <div class="app_menue">
      <AppMenue />
    </div>
    <div class="version_info">
      <VersionInfo />
    </div>
    <div class="nav_bar">
      <!-- <transition name="fade-classic" mode="out-in"> -->
      <NavBar v-if="!showWelcomePage" />
      <!-- </transition> -->
    </div>
    <div class="account_window">
      <AccountList v-if="!showWelcomePage" />
      <div v-else>creditor_v1</div>
    </div>
    <div v-if="loadedComponent" class="main_window">
      <component
        :is="loadedComponent.component"
        :key="loadedComponent.displayText"
      />
    </div>
    <div class="history_list">
      <!-- <transition name="fade-classic" mode="out-in"> -->
      <HistoryList v-if="!showWelcomePage" />
      <!-- </transition> -->
    </div>
    <div class="status_window">
      <!-- <transition name="fade-classic" mode="out-in"> -->
      <StatusWindow v-if="!showWelcomePage" />
      <!-- </transition> -->
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  defineAsyncComponent,
  onMounted,
  onBeforeUnmount,
} from "vue";

//Main modules
import VersionInfo from "@/components/Layout/VersionInfo.vue";
import AppMenue from "@/components/Layout/AppMenue.vue";
import HistoryList from "@/components/Layout/HistoryList.vue";
import NavBar from "@/components/Layout/NavBar.vue";
import AccountList from "@/components/Layout/AccountList.vue";
import StatusWindow from "@/components/Layout/StatusWindow.vue";

//Views
//Utilities
import { usePageNavigator } from "@/components/navigator";
import { importPages } from "@/components/component-registration";
import Welcome from "@/views/Welcome.vue";

//Start store
import { AccountTransferStore } from "@/store/data/data-store";
import { workerProvider } from "@/worker/worker-provider";
import { UserDataStore } from "@/store/user/user-data";

// const importPage = importPages();

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
    ...importPages(),
  },
  setup() {
    //Main view management
    const { currentPage, pages, settings } = usePageNavigator();
    //Show welcome page
    const showWelcomePage = computed(() => {
      return UserDataStore.firstStart;
    });
    //Load view
    const loadedComponent = computed(() => {
      if (showWelcomePage.value) {
        return { component: "Welcome", displayText: "Welcome" };
      }
      if (currentPage.value === "Settings") {
        return settings.value;
      }
      return pages.value.find(
        (entry) => entry.displayText === currentPage.value
      );
    });

    return {
      showWelcomePage,
      loadedComponent,
    };
  },
});
</script>
