<template>
  <h2>
    Create Transfer
    {{
      selectedAccount && accountDetails
        ? "[" + accountDetails.shortName._value + "]"
        : ""
    }}
  </h2>
  <div v-if="!accountDetails">
    <p
      v-for="account in accounts"
      :key="account._internalID._value"
      @click="setAccount(account._internalID._value)"
    >
      {{ account.shortName._value }}-[{{
        account.accountNumber._value
          ? account.accountNumber._value
          : account.shortName._value
      }}{{ account.provider._value ? " - " + account.provider._value : "" }}]
    </p>
  </div>
  <TransferCreator
    v-else-if="selectedAccount"
    :selectedAccount="selectedAccount"
    :accountDetails="accountDetails"
  />
  <div v-else>An Error occured !</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import {
  BasicAccountTypes,
  IBasicAccountClass,
} from "@/interfaces/accounts/accounts";
import { AccountTransferStore } from "@/store/data/data-store";
import TransferCreator from "@/components/TransferWizard/TransferCreator.vue";

export default defineComponent({
  name: "CreateTransfer",
  components: {
    TransferCreator,
  },
  setup() {
    const accounts = computed(() => {
      return AccountTransferStore.allAccounts;
    });
    onMounted(async () => {});
    const selectedAccount = ref<string | null>(null);
    const setAccount = (payload: string) => {
      selectedAccount.value = payload;
    };
    const accountDetails = computed(() => {
      return AccountTransferStore.allAccounts.find(
        (account: IBasicAccountClass) => {
          return account._internalID._value === selectedAccount.value;
        }
      );
    });
    return {
      accounts,
      selectedAccount,
      setAccount,
      accountDetails,
    };
  },
});
</script>

<style lang="scss"></style>
