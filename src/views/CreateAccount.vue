<template>
  <h2>Create Account</h2>
  <div>
    <p
      v-for="type in accountTypes"
      :key="type.accountType"
      @click="setCurrentType(type.accountType)"
    >
      {{ type.displayName }}
    </p>
  </div>
  <div v-if="currentSelectedType">
    <AccountCreator :accountType="currentSelectedType" />
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
      },
      {
        displayName: "Digital Account",
        accountType: BasicAccountTypes.DIGITAL_ACCOUNT,
      },
      {
        displayName: "Bank Account",
        accountType: BasicAccountTypes.BANK_ACCOUNT,
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

<style lang="scss"></style>
