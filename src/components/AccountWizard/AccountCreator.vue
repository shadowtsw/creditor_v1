<template>
  <div class="account-creator">
    <h2 class="account-creator__header">
      Create
      {{
        accountType === "CASH"
          ? "Cash"
          : accountType === "BANK_ACCOUNT"
          ? "Bank"
          : "Digital"
      }}Account
    </h2>
    <div class="forms-wrapper" v-if="!showSuccess && !showError">
      <!-- <div class="scroll-container" > -->
      <h3 class="basic-header">Basic Details</h3>
      <div class="basic-details__wrapper">
        <!-- BASIC STARTS -->
        <div
          :class="[
            'field-wrapper',
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
        <div :class="['field-wrapper']">
          <label for="currency">Currency: </label>
          <select name="currency" v-model="preConfiguredObject.currency">
            <option disabled value="">Please select one</option>
            <option v-for="currency in currencies" :key="currency">
              {{ currency }}
            </option>
          </select>
          <span v-if="showInfo || !validateResult.currencyError"
            >Please select the currency</span
          >
          <span v-else-if="!showInfo && validateResult.currencyError">{{
            validateResult.currencyError
          }}</span>
        </div>
        <div
          :class="[
            'field-wrapper',
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
            'field-wrapper',
            'dev',
            {
              '--try-danger':
                !showInfo && validateResult.openingBalanceDateError,
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
          <span
            v-else-if="!showInfo && validateResult.openingBalanceDateError"
            >{{ validateResult.openingBalanceDateError }}</span
          >
        </div>
        <!-- BASIC ENDS -->
      </div>
      <transition name="fade-classic" mode="out-in">
        <h3
          v-if="
            accountType === 'DIGITAL_ACCOUNT' || accountType === 'BANK_ACCOUNT'
          "
          class="digital-header"
        >
          Digital Details
        </h3>
      </transition>
      <transition name="fade-classic" mode="out-in">
        <div
          v-if="
            accountType === 'DIGITAL_ACCOUNT' || accountType === 'BANK_ACCOUNT'
          "
          class="digital-details__wrapper"
        >
          <!-- DIGITAL STARTS -->
          <div>
            <div
              :class="[
                'field-wrapper',
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
                >Provider of Account</span
              >
              <span v-else-if="!showInfo && validateResult.providerError">{{
                validateResult.providerError
              }}</span>
            </div>
            <div
              :class="[
                'field-wrapper',
                'dev',
                {
                  '--try-danger':
                    !showInfo && validateResult.accountNumberError,
                },
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
              <span
                v-else-if="!showInfo && validateResult.accountNumberError"
                >{{ validateResult.accountNumberError }}</span
              >
            </div>
          </div>
          <!-- DIGITAL ENDS -->
        </div>
      </transition>
      <transition name="fade-classic" mode="out-in">
        <h3 v-if="accountType === 'BANK_ACCOUNT'" class="bank-header">
          Basic Details
        </h3>
      </transition>
      <transition name="fade-classic" mode="out-in">
        <div
          v-if="accountType === 'BANK_ACCOUNT'"
          class="bank-details__wrapper"
        >
          <!-- BANK STARTS -->
          <div>
            <div>Bank account</div>
          </div>
          <div>
            <div>Bank account</div>
          </div>
          <div>
            <div>Bank account</div>
          </div>
          <!-- BANK ENDS -->
        </div>
      </transition>
    </div>
    <div v-else-if="showSuccess && !showError">
      <p class="success-message">Account added successful</p>
      <button @click="addMoreAccounts">Add more Accounts</button>
    </div>
    <div v-else-if="showError">
      <p class="failed-message">{{ errorMessage }}</p>
      <button @click="editValues">Give it another try</button>
    </div>
    <button v-if="!showSuccess && !showError" @click="startCreateAccount">
      <span>Create Account</span>
    </button>
  </div>
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
    const currencies = computed(() => {
      return Object.values(CurrencyValues);
    });

    //AccountObject
    const {
      setAccountType,
      hasErrors,
      preConfiguredObject,
      validateResult,
      createAccount,
      resetDigitalAccountValues,
      resetBankAccountValues,
      reset,
    } = useAccountCreator();

    const showInfo = ref<boolean>(true);

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
      startCreateAccount,
      currencies,
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
@use "@/styles/placeholders";

.account-creator {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  .account-creator__header {
    @extend %h2-header-spacing;
    align-self: flex-start;
  }
  .forms-wrapper {
    flex: 1;
    min-height: 0;
    width: 100%;
    overflow: auto;
    .basic-details__wrapper,
    .digital-details__wrapper,
    .bank-details__wrapper {
      @extend %default-border-radius;
      @extend %default-padding;
      max-width: 65%;
      margin: 0 auto;
    }
    .field-wrapper {
      width: 100%;
      @extend %field-wrapper;
      box-sizing: border-box;
    }
    .basic-header {
      @extend %h3-header-spacing;
      padding: 0 0.3rem;
    }
    .digital-header {
      @extend %h3-header-spacing;
      padding: 0 0.3rem;
    }
    .bank-header {
      @extend %h3-header-spacing;
      padding: 0 0.3rem;
    }
  }
  button {
    width: 100%;
    height: 1.6rem;
    margin-top: 0.6rem;
  }
}
</style>
