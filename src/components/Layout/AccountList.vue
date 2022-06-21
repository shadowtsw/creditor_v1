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
import { computed, defineComponent, onMounted } from "vue";
import AccountItem from "../AccountList/AccountItem.vue";
import AccountToolbar from "../AccountList/AccountToolbar.vue";

import { AccountTransferStore } from "@/store/account-transfer/account-transfer-store";

import { AccountBalanceObject } from "@/interfaces/accounts/saldo-balance-types";
import { LogMe } from "@/logging/logger-function";

export default defineComponent({
  components: {
    AccountToolbar,
    AccountItem,
  },
  setup() {
    onMounted(() => {
      LogMe.mount("AccountList");
    });

    //Account related
    const accountList = computed(() => AccountTransferStore.allAccounts);

    const accountBalanceSummary = computed(
      (): Array<(AccountBalanceObject & { isLoading: boolean }) | never> => {
        return AccountTransferStore.accountBalanceSummary;
      }
    );

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
