<template>
  <AccountToolbar />
  <div class="account_wrapper" v-if="accountList.length > 0">
    <AccountItem
      v-for="account in accounts"
      :isLoading="summaryObject[account._internalID._value].isLoading || false"
      :account="account"
      :key="account._internalID._value"
      :summary="summaryObject[account._internalID._value]"
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
} from "@/worker/worker-provider";
import { getLatestAccountBalance } from "@/worker/worker-functions/account-assist-worker/account-balance";

export default defineComponent({
  components: {
    AccountToolbar,
    AccountItem,
  },
  setup() {
    const demoMode = computed(() => {
      return ApplicationEnvironment.Demo;
    });
    //Web-Worker starts
    const cardWorker: AccountAssistantWorker = accountAssistantWorker;
    const unsubscribe = ref<null | Function>(null);
    onMounted(() => {
      if (!demoMode.value) {
        unsubscribe.value = cardWorker.subscribeBalanceMessage({
          id: "AccountList",
          callback: (data: ResponseBalanceMessage) => {
            console.log("INCOMING MESSAGE", data);
            setAccountData(data.topic.accountID, data.data);
          },
        });
      }
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

    //Initial calculation
    watch(accountList, (newValue, oldValue) => {
      if (oldValue.length === 0) {
        accountList.value.forEach((entry) => {
          if (!demoMode.value) {
            setAccountData(entry._internalID._value);
            postCalculation(entry._internalID._value);
          } else {
            // setAccountData(entry._internalID._value, getLatestAccountBalance());
          }
        });
      } else {
        newValue.forEach((entry) => {
          if (!demoMode.value) {
            if (!summaryObject.hasOwnProperty(entry._internalID._value)) {
              setAccountData(entry._internalID._value);
              postCalculation(entry._internalID._value);
            }
          } else {
            // setAccountData(entry._internalID._value, getLatestAccountBalance());
          }
        });
      }
    });

    //Functions
    const setAccountData = (accountID: string, data?: AccountBalanceObject) => {
      console.log("SETS ACCOUNT DATA");
      if (data) {
        console.log("WITH DATA");
        summaryObject[accountID] = {
          ...data,
          ...{ isLoading: false },
        };
      } else {
        console.log("WITH DUMMY");
        //Sets dummy with loading state
        summaryObject[accountID] = {
          isLoading: true,
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
    };
    const postCalculation = (accountID: string) => {
      const requestMessage: RequestBalanceMessage = {
        topic: {
          type: AccountAssistMessageTypes.REQUEST_CALC,
          accountID: accountID,
        },
      };
      cardWorker.postMessage(requestMessage);
    };

    return {
      accounts: accountList,
      accountList,
      summaryObject,
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
