<template>
  <h2>
    Create
    {{
      accountType === "CASH"
        ? "Cash"
        : accountType === "BANK_ACCOUNT"
        ? "Bank"
        : "Digital"
    }}Account
  </h2>
  <span>INFO</span>
  <div v-if="!showSuccess && !showError">
    <div>
      <!-- <div
        v-if="accountType === 'CASH'"
        :class="[
          'dev',
          { '--try-danger': !showInfo && validateResult.IDError },
        ]"
      >
        <label for="customID">Unique Identifier: </label>
        <input
          type="text"
          v-model.trim="preConfiguredObject._ID"
          name="customID"
        />
        <span v-if="showInfo || !validateResult.IDError"
          >Needed to uniquely identify your account</span
        >
        <span v-else-if="!showInfo && validateResult.IDError">{{
          validateResult.IDError
        }}</span>
      </div> -->
      <div
        :class="[
          'dev',
          { '--try-danger': !showInfo && validateResult.shortNameError },
        ]"
      >
        <label for="shortName">Name: </label>
        <input
          type="text"
          v-model.trim="preConfiguredObject.shortName"
          name="shortName"
        />
        <span v-if="showInfo || !validateResult.shortNameError"
          >Display custom name</span
        >
        <span v-else-if="!showInfo && validateResult.shortNameError">{{
          validateResult.shortNameError
        }}</span>
      </div>
      <div :class="['dev']">
        <label for="currency">Currency: </label>
        <input
          type="text"
          v-model="preConfiguredObject.currency"
          name="currency"
        />
      </div>
      <div
        :class="[
          'dev',
          { '--try-danger': !showInfo && validateResult.openingBalanceError },
        ]"
      >
        <label for="openingBalance">Opening Balance: </label>
        <input
          type="text"
          v-model.number="preConfiguredObject.openingBalance"
          name="openingBalance"
        />
        <span v-if="showInfo || !validateResult.openingBalanceError"
          >Starting value</span
        >
        <span v-else-if="!showInfo && validateResult.openingBalanceError">{{
          validateResult.openingBalanceError
        }}</span>
      </div>
      <div
        :class="[
          'dev',
          {
            '--try-danger': !showInfo && validateResult.openingBalanceDateError,
          },
        ]"
      >
        <label for="openingBalanceDate">Date of opening</label>
        <input
          type="text"
          v-model.trim="preConfiguredObject.openingBalanceDate"
          name="openingBalanceDate"
          placeholder="dd-mm-yyyy"
        />
        <span v-if="showInfo || !validateResult.openingBalanceDateError"
          >Date for starting value</span
        >
        <span v-else-if="!showInfo && validateResult.openingBalanceDateError">{{
          validateResult.openingBalanceDateError
        }}</span>
      </div>
    </div>
    <div
      v-if="accountType === 'DIGITAL_ACCOUNT' || accountType === 'BANK_ACCOUNT'"
    >
      <div
        :class="[
          'dev',
          { '--try-danger': !showInfo && validateResult.providerError },
        ]"
      >
        <label for="provider">Provider: </label>
        <input
          type="text"
          v-model.trim="preConfiguredObject.provider"
          name="provider"
        />
        <span v-if="showInfo || !validateResult.providerError"
          >Date for starting value</span
        >
        <span v-else-if="!showInfo && validateResult.providerError">{{
          validateResult.providerError
        }}</span>
      </div>
      <div
        :class="[
          'dev',
          { '--try-danger': !showInfo && validateResult.accountNumberError },
        ]"
      >
        <label for="accountNumber">Account No.: </label>
        <input
          type="text"
          v-model.trim="preConfiguredObject.accountNumber"
          name="accountNumber"
        />
        <span v-if="showInfo || !validateResult.accountNumberError"
          >AccountNo.</span
        >
        <span v-else-if="!showInfo && validateResult.accountNumberError">{{
          validateResult.accountNumberError
        }}</span>
      </div>
    </div>
    <div v-if="accountType === 'BANK_ACCOUNT'">Bank account</div>
  </div>
  <div v-else-if="showSuccess && !showError">
    <p>Account added successful</p>
    <button @click="addMoreAccounts">Add more Accounts</button>
  </div>
  <div v-else-if="showError">
    <p>{{ errorMessage }}</p>
    <button @click="editValues">Give it another try</button>
  </div>
  <button v-if="!showSuccess && !showError" @click="startCreateAccount">
    createAccount
  </button>
</template>

<script lang="ts">
import {
  BasicAccountTypes,
  CurrencyValues,
} from "@/interfaces/accounts/accounts";
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  watch,
} from "vue";
import { useAccountCreator } from "./account-creator";
// import CustomLabel from "./CustomLabel.vue";

export default defineComponent({
  props: {
    accountType: {
      type: String as PropType<BasicAccountTypes>,
      required: true,
    },
  },
  setup(props) {
    //AccountType
    onMounted(async () => {
      setAccountType(props.accountType);
    });
    const accountType = computed(() => {
      return props.accountType;
    });
    watch(accountType, (newVal) => {
      setAccountType(newVal);
      if (newVal === BasicAccountTypes.CASH) {
        resetDigitalAccountValues();
        resetBankAccountValues();
      } else if (newVal === BasicAccountTypes.DIGITAL_ACCOUNT) {
        resetBankAccountValues();
      }
    });

    //AccountObject
    const {
      setAccountType,
      hasErrors,
      preConfiguredObject,
      validateResult,
      getCurrency,
      setCurrency,
      createAccount,
      resetDigitalAccountValues,
      resetBankAccountValues,
      reset,
    } = useAccountCreator();

    const showInfo = ref<boolean>(true);

    //TODO NOTE: CURRENCY
    const currency = computed({
      get(): CurrencyValues {
        return getCurrency.value;
      },
      set(value: CurrencyValues) {
        setCurrency(value);
      },
    });

    //Confirmation
    const showSuccess = ref<boolean>(false);
    const showError = ref<boolean>(false);
    const errorMessage = ref<string>("");

    const startCreateAccount = async () => {
      if (hasErrors()) {
        showInfo.value = false;
        console.log("hasErrors", hasErrors());
        return;
      }
      try {
        const createResult = await createAccount();
        console.log("createResult", createResult);
        if (createResult) {
          showSuccess.value = true;
        }
      } catch (err) {
        console.log("err", err);
        showError.value = true;
        if (err instanceof Error) {
          errorMessage.value = err.message;
        }
      }
    };
    const addMoreAccounts = () => {
      showSuccess.value = false;
      reset();
    };
    const editValues = () => {
      showSuccess.value = false;
      showError.value = false;
    };

    return {
      preConfiguredObject,
      validateResult,
      currency,
      startCreateAccount,
      showInfo,
      showSuccess,
      addMoreAccounts,
      showError,
      errorMessage,
      editValues,
    };
  },
});
</script>

<style lang="scss">
.dev {
  &.--try-danger {
    border: 2px solid red;
  }
}
</style>
