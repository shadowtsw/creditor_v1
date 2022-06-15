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
} from "@/worker/message-interfaces/account-assist-interface";
import { AccountBalanceObject } from "@/interfaces/accounts/saldo-balance-types";
import {
  AccountAssistantWorker,
  accountAssistantWorker,
} from "@/worker/worker-provider";

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
                startBalance: 0,
                endBalance: 0,
                income: 0,
                outgoing: 0,
                sum: 0,
              },
              currentMonth: {
                startBalance: 0,
                endBalance: 0,
                income: 0,
                outgoing: 0,
                sum: 0,
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
      const accountBalanceObject = {
        ...data,
        ...{ isLoading: false },
      };
      summaryObject[accountID] = accountBalanceObject;
    };
    const postCalculation = (accountID: string) => {
      const placeholder = {
        isLoading: false,
        lastMonth: {
          startBalance: 0,
          endBalance: 0,
          income: 0,
          outgoing: 0,
          sum: 0,
        },
        currentMonth: {
          startBalance: 0,
          endBalance: 0,
          income: 0,
          outgoing: 0,
          sum: 0,
        },
      };
      summaryObject[accountID] = placeholder;
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
