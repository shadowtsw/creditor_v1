<template>
  <AccountToolbar />
  <div class="account_wrapper" v-if="accountList.length > 0 && !loading">
    <AccountItem
      v-for="account in accounts"
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

import { AccountTransferStore } from "@/store/data/data-store";
import {
  AccountCalcData,
  InitMessage,
  InitMessageTargets,
  InitMessageTypes,
} from "@/worker/message-interfaces/db-worker";

export default defineComponent({
  components: {
    AccountToolbar,
    AccountItem,
  },
  setup() {
    const cardWorker = ref<null | Worker>(null);
    const loading = computed(() => {
      let loading = false;
      for (const sumObject in summaryObject) {
        if (summaryObject[sumObject].isLoading) {
          loading = true;
        }
      }
      return loading;
    });

    onMounted(() => {
      if (!cardWorker.value) {
        cardWorker.value = new Worker(
          new URL("../../worker/account-card-worker.ts", import.meta.url),
          {
            type: "module",
          }
        );
        cardWorker.value.addEventListener("message", (event) => {
          if (event.data.calc) {
            const message = event.data;
            const sumObject = { ...message.data, ...{ isLoading: false } };
            summaryObject[message.targetAccount] = sumObject;
          }
        });

        const initAccountDBMessage: InitMessage = {
          topic: {
            type: InitMessageTypes.INIT,
            target: InitMessageTargets.ACCOUNT_DB,
          },
        };

        cardWorker.value?.postMessage(initAccountDBMessage);

        const initTransferDBMessage: InitMessage = {
          topic: {
            type: InitMessageTypes.INIT,
            target: InitMessageTargets.TRANSFER_DB,
          },
        };

        cardWorker.value?.postMessage(initTransferDBMessage);
      }
    });
    onBeforeUnmount(() => {
      cardWorker.value?.terminate();
    });

    const accountList = computed(() => AccountTransferStore.allAccounts);

    const summaryObject = reactive<{
      [index: string]: AccountCalcData & { isLoading: boolean };
    }>({});

    watch(accountList, (newValue, oldValue) => {
      if (oldValue.length === 0) {
        accountList.value.forEach((entry) => {
          summaryObject[entry._internalID._value] = {
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
          postCalculation(entry._internalID._value);
        });
      } else {
        newValue.forEach((entry) => {
          if (!summaryObject.hasOwnProperty(entry._internalID._value)) {
            summaryObject[entry._internalID._value] = {
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
            postCalculation(entry._internalID._value);
          }
        });
      }
    });

    const postCalculation = (accountID: string) => {
      cardWorker.value?.postMessage({
        calc: true,
        targetAccount: accountID,
      });
    };

    return {
      accounts: accountList,
      accountList,
      summaryObject,
      loading,
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
