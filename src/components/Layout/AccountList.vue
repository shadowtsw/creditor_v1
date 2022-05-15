<template>
  <AccountToolbar />
  <div class="account_wrapper">
    <AccountItem
      v-for="account in accounts"
      :account="account"
      :key="account._internalID._value"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import AccountItem from "../AccountList/AccountItem.vue";
import AccountToolbar from "../AccountList/AccountToolbar.vue";

import { AccountTransferStore } from "@/store/data/data-store";

export default defineComponent({
  components: {
    AccountToolbar,
    AccountItem,
  },
  setup() {
    const accountList = computed(() => AccountTransferStore.allAccounts);

    return {
      accounts: accountList,
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
