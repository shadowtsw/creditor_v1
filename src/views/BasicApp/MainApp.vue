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
  watch,
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
import IndexedDBAppStateStoreManager from "@/indexedDB/app-state-indexeddb";

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
    onMounted(async () => {
      try {
        //Init User & App states
        await UserDataStore.initAppStateData();
        //Init Account data
        await AccountTransferStore.initAccounts();
        await AccountTransferStore.initTransfers();
      } catch (err) {
        console.info("WARNING: ERROR during Init()", err);
      }
    });
    const {
      activateCreateTransfers,
      hideCreateTransfers,
      activateTransferList,
      hideTransferList,
      currentPage,
      pages,
      settings,
    } = usePageNavigator();

    // Watch accounts
    const accountsLength = computed(() => {
      return AccountTransferStore.allAccounts.length;
    });
    watch(accountsLength, (newVal, oldVal) => {
      if (newVal > 0) {
        activateCreateTransfers();
      } else {
        hideCreateTransfers();
      }
    });
    //Watch transfers
    const transfersLength = computed(() => {
      return AccountTransferStore.allTransfers.length;
    });
    watch(transfersLength, (newVal, oldVal) => {
      if (newVal > 0) {
        activateTransferList();
      } else {
        hideTransferList();
      }
    });
    //

    //Main view management

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
    };
  },
});
</script>
