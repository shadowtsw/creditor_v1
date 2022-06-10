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
  AAWReqBalance,
  AAWResBalance,
  AAWResPagination,
  AAW_MessageTypes,
  AccountBalanceObject,
  RequestBalanceMessage,
  ResponseBalanceMessage,
} from "@/worker/message-interfaces/account-assist-interface";
import {
  AccountAssistantWorker,
  accountAssistantWorker,
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
    //Web-Worker starts
    const cardWorker: AccountAssistantWorker = accountAssistantWorker;
    const unsubscribeBalance = ref<null | Function>(null);
    const unsubscribePagination = ref<null | Function>(null);
    onMounted(() => {
      //AccountList can manage most of the needed actions since its never being unmounted during lifetime
      unsubscribeBalance.value = cardWorker.subscribeBalanceMessage({
        id: "AccountList",
        callback: (data: AAWResBalance) => {
          setAccountData(data.messageData.accountID, data.messageData.data);
        },
      });
      unsubscribePagination.value = cardWorker.subscribePaginationMessage({
        id: "AccountList",
        callback: (data: AAWResPagination) => {
          AccountTransferStore.commitPagination(data.messageData);
        },
      });
      initAccountBalanceData();
      requestPagination();
    });
    onBeforeUnmount(() => {
      if (unsubscribeBalance.value) {
        unsubscribeBalance.value();
      }
      if (unsubscribePagination.value) {
        unsubscribePagination.value();
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

    //Functions
    //Prod
    const initAccountBalanceData = () => {
      for (const entry of accountList.value) {
        postCalculation(entry._internalID._value);
      }
    };
    const setAccountData = (accountID: string, data: AccountBalanceObject) => {
      summaryObject[accountID] = {
        ...data,
        ...{ isLoading: false },
      };
    };
    const postCalculation = (accountID: string) => {
      summaryObject[accountID] = {
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
      const requestMessage: AAWReqBalance = {
        type: AAW_MessageTypes.REQUEST_CALC,
        messageData: {
          accountID: accountID,
        },
      };
      cardWorker.postMessage(requestMessage);
    };
    const requestPagination = () => {
      cardWorker.postMessage({
        type: AAW_MessageTypes.REQUEST_PAGINATION,
      });
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
