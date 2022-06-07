<template>
  <AccountToolbar />
  <div class="account_wrapper" v-if="accountList.length > 0">
    <AccountItem
      v-for="(account, index) in accountList"
      :isLoading="accountBalanceSummary[index].isLoading"
      :account="account"
      :key="account._internalID._value"
      :summary="accountBalanceSummary[index]"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import AccountItem from "../AccountList/AccountItem.vue";
import AccountToolbar from "../AccountList/AccountToolbar.vue";

import { AccountTransferStore } from "@/store/account-transfer/account-transfer-store";
import {
  AccountAssistMessageTypes,
  AccountBalanceObject,
  RequestBalanceMessage,
  ResponseBalanceMessage,
} from "@/worker/message-interfaces/account-assist-interface";
import {
  AccountAssistantWorker,
  accountAssistantWorker,
  DemoWorker,
} from "@/worker/worker-provider";
import { getLatestAccountBalance } from "@/worker/worker-functions/account-assist-worker/account-balance";
import { ApplicationEnvironmentStore } from "@/store/application/application-store";
import { IBasicAccountClass } from "@/interfaces/accounts/accounts";
import { ExampleWorker } from "../../../.history/src/store/account-transfer/demo-worker-types_20220605000408";

export default defineComponent({
  components: {
    AccountToolbar,
    AccountItem,
  },
  setup() {
    const demoMode = computed(() => {
      return ApplicationEnvironmentStore.Demo;
    });
    //Web-Worker starts
    const cardWorker: AccountAssistantWorker = accountAssistantWorker;
    const unsubscribe = ref<null | Function>(null);
    onMounted(() => {
      unsubscribe.value = cardWorker.subscribeBalanceMessage({
        id: "AccountList",
        callback: (data: ResponseBalanceMessage) => {
          console.log("INCOMING MESSAGE", data);
          setAccountData(data.topic.accountID, data.data);
        },
      });
      initAccountBalanceData();
    });
    onBeforeUnmount(() => {
      if (unsubscribe.value) {
        // console.log("Subscription removed");
        unsubscribe.value();
      }
    });
    //Web-Worker ends

    //Account related
    const accountList = computed(() => AccountTransferStore.allAccounts);
    const summaryObject = reactive<{
      [index: string]: AccountBalanceObject & { isLoading: boolean };
    }>({});
    const accountBalanceSummary = computed(
      (): Array<(AccountBalanceObject & { isLoading: boolean }) | never> => {
        return accountList.value.map((entry) => {
          if (summaryObject[entry._internalID._value]) {
            return summaryObject[entry._internalID._value];
          } else {
            return {
              isLoading: false,
              lastMonth: {
                balance: 0,
                income: 0,
                outgoing: 0,
              },
              currentMonth: {
                balance: 0,
                income: 0,
                outgoing: 0,
              },
            };
          }
        });
      }
    );
    //Account related

    //Initial calculation
    // watch(accountList, async (newValue, oldValue) => {
    //   console.log("AccountList watch", newValue);
    //   if (oldValue.length === 0) {
    //     for (const entry of accountList.value) {
    //       if (!demoMode.value) {
    //         postCalculation(entry._internalID._value);
    //       } else {
    //         //DEMO WORKER ONLY
    //         setDemoData(entry);
    //       }
    //     }
    //   } else {
    //     for (const entry of newValue) {
    //       if (!demoMode.value) {
    //         if (!summaryObject.hasOwnProperty(entry._internalID._value)) {
    //           postCalculation(entry._internalID._value);
    //         }
    //       } else {
    //         //DEMO WORKER ONLY
    //         setDemoData(entry);
    //       }
    //     }
    //   }
    // });

    //Functions
    //Prod
    const initAccountBalanceData = () => {
      for (const entry of accountList.value) {
        if (!demoMode.value) {
          postCalculation(entry._internalID._value);
        }
      }
    };
    const setAccountData = (accountID: string, data: AccountBalanceObject) => {
      summaryObject[accountID] = {
        ...data,
        ...{ isLoading: false },
      };
    };
    const postCalculation = (accountID: string) => {
      summaryObject[accountID].isLoading = true;
      const requestMessage: RequestBalanceMessage = {
        topic: {
          type: AccountAssistMessageTypes.REQUEST_CALC,
          accountID: accountID,
        },
      };
      cardWorker.postMessage(requestMessage);
    };

    return {
      accountList,
      accountBalanceSummary,
    };
  },
});
</script>
<style lang="scss">
@use "@/styles/placeholders.scss" as *;

.account_wrapper {
  height: calc(100% - 4.8rem - 2px);
  overflow-y: scroll;
  @extend %flex-default-center;
  justify-content: flex-start;
  flex-direction: column;
  // .account-card {
  // }

  // .account-card__short-name {
  // }

  // .account-card__details {
  // }

  // .account-card__select {
  // }

  // .account-card__income {
  // }

  // .account-card__outgoing {
  // }

  // .account-card__funds {
  // }
}
</style>
