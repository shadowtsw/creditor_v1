<template>
  <div class="create-account">
    <h2 class="create-account__header">Choose Account Type</h2>
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
    <div class="account-creator__wrapper" v-if="currentSelectedType">
      <AccountCreator :accountType="currentSelectedType" />
    </div>
    <div class="choose-account" v-else>
      <p>Please choose account type</p>
    </div>
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
        info: "IBAN/SWIFT CAMT-Format -> IMPORT CSV ONLY",
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

.create-account {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  .create-account__header {
    align-self: flex-start;
  }
  .create-account__account-list-container {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    padding: 0.6rem 0;
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

  .account-creator__wrapper {
    width: 100%;
    h2 {
      margin: 0;
      padding: 0.3rem;
      padding-bottom: 0.6rem;
    }
    flex: 1;
    min-height: 0;
    background-color: rgba(166, 165, 165, 0.08);
  }

  .choose-account {
    margin: 1rem auto;
    text-align: center;
  }
}
</style>
