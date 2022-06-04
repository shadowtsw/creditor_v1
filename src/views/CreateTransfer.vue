<template>
  <div class="create-transfer">
    <h2>
      Create Transfer
      {{
        selectedAccount && accountDetails
          ? "[" + accountDetails.shortName._value + "]"
          : ""
      }}
    </h2>
    <div v-if="!accountDetails" class="account-selector">
      <p
        v-for="account in accounts"
        :key="account._internalID._value"
        @click="setAccount(account._internalID._value)"
      >
        <span>{{ account.shortName._value }} - </span>
        <span
          >[{{
            account.accountNumber._value
              ? account.accountNumber._value
              : account.shortName._value
          }}{{
            account.provider._value ? " - " + account.provider._value : ""
          }}]</span
        >
      </p>
    </div>
    <TransferCreator
      v-else-if="selectedAccount"
      :selectedAccount="selectedAccount"
      :accountDetails="accountDetails"
    />
    <div v-else>An Error occured !</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import {
  BasicAccountTypes,
  IBasicAccountClass,
} from "@/interfaces/accounts/accounts";
import { AccountTransferStore } from "@/store/account-transfer/account-transfer-store";
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

<style lang="scss">
@use "@/styles/placeholders";
.create-transfer {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  h2 {
    align-self: flex-start;
  }
  .account-selector {
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    p {
      min-width: 5rem;
      @extend %small-border-radius;
      margin: 0 0.3rem;
      border: 1px solid var(--text-color);
      @extend %creditor-link;
      padding: 0.3rem;
      &:first-child {
        margin-left: unset;
      }
      span:first-child {
        font-weight: bold;
        font-size: 1.1rem;
      }
    }
  }
  .forms-wrapper {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    width: 100%;
    .field-wrapper {
      width: 80%;
      margin: 0 auto;
      @extend %field-wrapper;
      box-sizing: border-box;
      &:first-child {
        margin-top: 0.6rem;
      }
      &:last-child {
        margin-bottom: 0.6rem;
      }
    }
  }
  button {
    width: 100%;
    height: 1.6rem;
  }
}
</style>
