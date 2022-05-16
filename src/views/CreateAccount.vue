<template>
  <h2>Choose Account Type</h2>
  <div class="create-account__account-list-container">
    <div
      v-for="type in accountTypes"
      :key="type.accountType"
      @click="setCurrentType(type.accountType)"
      class="account-list__entry"
      :class="[{ '--is-active': type.accountType === currentSelectedType }]"
    >
      <p>
        {{ type.displayName }}
      </p>
      <p class="info-text">{{ type.info }}</p>
    </div>
  </div>
  <div v-if="currentSelectedType">
    <AccountCreator :accountType="currentSelectedType" />
  </div>
  <div class="choose-account" v-else>
    <p>Please choose account type</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import AccountCreator from "@/components/AccountWizard/AccountCreator.vue";
import { BasicAccountTypes } from "@/interfaces/accounts/accounts";

export default defineComponent({
  components: {
    AccountCreator,
  },
  setup() {
    onMounted(async () => {});
    const accountTypes = reactive([
      {
        displayName: "Cash",
        accountType: BasicAccountTypes.CASH,
        info: "Cash only, shopping etc.",
      },
      {
        displayName: "Digital Account",
        accountType: BasicAccountTypes.DIGITAL_ACCOUNT,
        info: "Accounts with username, eg. PayPal",
      },
      {
        displayName: "Bank Account",
        accountType: BasicAccountTypes.BANK_ACCOUNT,
        info: "IBAN/SWIFT CAMT-Format",
      },
    ]);
    const currentSelectedType = ref<BasicAccountTypes | null>(null);
    const setCurrentType = (payload: BasicAccountTypes) => {
      currentSelectedType.value = payload;
    };
    return {
      accountTypes,
      currentSelectedType,
      setCurrentType,
    };
  },
});
</script>

<style lang="scss">
@use "@/styles/placeholders";
@use "@/styles/variables" as *;

.create-account__account-list-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  .account-list__entry {
    width: 25%;
    text-align: center;
    @extend %default-border-radius;
    @extend %creditor-link;
    font-size: 1.2rem;
    padding: $defaultPaddingSize;

    p {
      @extend %clean-padding-margin;
    }

    .info-text {
      margin-top: $defaultPaddingSize;
      font-size: 0.9rem;
    }
  }
}

.choose-account {
  margin: 1rem auto;
  text-align: center;
}
</style>
