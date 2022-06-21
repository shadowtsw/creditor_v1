<template></template>
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

import { ApplicationEnvironmentStore } from "@/store/application/application-store";
import { AccountTransferStore } from "@/store/account-transfer/account-transfer-store";
import { usePageNavigator, usePluginNavigator } from "@/components/navigator";
import { initAppState, initDemoState } from "./init-functions";
import { LogMe } from "@/logging/logger-function";
import { AccountAssistantWorker } from "@/worker/worker-provider";
import {
  AAWInit,
  AAWResBalance,
  AAWResPagination,
  AAW_MessageTypes,
  InitMessageTargets,
} from "@/worker/message-interfaces/account-assist-interface";

export default defineComponent({
  setup() {
    onMounted(async () => {
      LogMe.mount("AppStateManager");
      try {
        //First init AppState
        await ApplicationEnvironmentStore.initApplicationStore();
      } catch (err) {
        console.info("WARNING: ERROR during Init()", err);
      }
    });
    const {
      activateDemoTabs,
      activateCreateTransfers,
      hideCreateTransfers,
      activateTransferList,
      hideTransferList,
    } = usePageNavigator();
    const { activateDemoPlugins } = usePluginNavigator();

    //Watch welcome screen and set app state
    const useDemo = computed(() => {
      return ApplicationEnvironmentStore.Demo;
    });
    watch(useDemo, (newVal) => {
      if (newVal !== null && newVal) {
        initDemoState();
      } else if (newVal !== null && !newVal) {
        initAppState();
      } else {
        console.error("Cannot set AppState");
      }
    });
    //If app is ready, proceed with subscriptions
    const appIsReady = computed(() => {
      return ApplicationEnvironmentStore.appReady;
    });
    const workerIsReady = computed(() => {
      return ApplicationEnvironmentStore.workerIsReady;
    });

    const unsubscribeBalance = ref<null | Function>(null);
    const unsubscribePagination = ref<null | Function>(null);

    watch(workerIsReady, (newVal) => {
      if (newVal !== null && newVal && appIsReady.value) {
        unsubscribeBalance.value =
          AccountAssistantWorker.WorkerProvider.subscribeBalanceMessage({
            id: "AccountList",
            callback: (data: AAWResBalance) => {
              AccountTransferStore.commitAccountBalanceDataUpdate(data);
            },
          });

        unsubscribePagination.value =
          AccountAssistantWorker.WorkerProvider.subscribePaginationMessage({
            id: "TransferList",
            callback: (data: AAWResPagination) => {
              AccountTransferStore.commitPagination(data.messageData);
            },
          });

        //Inits and trigger response to all account data and meta data
        const initDBMessage: AAWInit = {
          type: AAW_MessageTypes.INIT,
          messageData: {
            target: InitMessageTargets.INIT_APP,
          },
        };

        AccountAssistantWorker.WorkerProvider.postMessage(initDBMessage);
        if (useDemo.value) {
          activateDemoTabs();
          activateDemoPlugins();
        }
      }
    });

    onBeforeUnmount(() => {
      if (unsubscribeBalance.value) {
        unsubscribeBalance.value();
      }
      if (unsubscribePagination.value) {
        unsubscribePagination.value();
      }
    });

    // Watch accounts in case of using not the demo
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
    //TODO: nee to count and watch transfers
    // const transfersLength = computed(() => {
    //   return AccountTransferStore.allTransfers.length;
    // });
    // watch(transfersLength, (newVal, oldVal) => {
    //   if (newVal > 0) {
    //     activateTransferList();
    //   } else {
    //     hideTransferList();
    //   }
    // });
    //
  },
});
</script>
