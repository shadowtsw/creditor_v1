<template>
  <div class="forms-wrapper" v-if="!showSuccess && !showError">
    <!-- REQUIRED -->
    <div
      :class="[
        'field-wrapper',
        { '--try-danger': !showInfo && validateResult.valueError },
      ]"
    >
      <label for="value">Value: </label>
      <input
        type="text"
        v-model.trim="preConfiguredObject.value"
        name="value"
      />
      <span v-if="showInfo || !validateResult.valueError">Credited value</span>
      <span v-else-if="!showInfo && validateResult.valueError">{{
        validateResult.valueError
      }}</span>
    </div>
    <div
      :class="[
        'field-wrapper',
        { '--try-danger': !showInfo && validateResult.purposeError },
      ]"
    >
      <label for="purpose">Purpose: </label>
      <input
        type="text"
        v-model.trim="preConfiguredObject.purpose"
        name="purpose"
      />
      <span v-if="showInfo || !validateResult.purposeError">Purpose</span>
      <span v-else-if="!showInfo && validateResult.purposeError">{{
        validateResult.purposeError
      }}</span>
    </div>
    <div
      :class="[
        'field-wrapper',
        { '--try-danger': !showInfo && validateResult.valutaDateError },
      ]"
    >
      <label for="valutaDate">ValutaDate: </label>
      <input
        type="text"
        v-model.trim="preConfiguredObject.valutaDate"
        name="valutaDate"
      />
      <span v-if="showInfo || !validateResult.valutaDateError"
        >Date of credit</span
      >
      <span v-else-if="!showInfo && validateResult.valutaDateError">{{
        validateResult.valutaDateError
      }}</span>
    </div>
    <!-- OPTIONAL -->
    <div :class="['field-wrapper']">
      <label for="shortName">Name: </label>
      <input
        type="text"
        v-model.trim="preConfiguredObject.shortName"
        name="shortName"
      />
      <span>Name, shortname or alias</span>
    </div>
    <div :class="['field-wrapper']">
      <label for="description">Description: </label>
      <input
        type="text"
        v-model.trim="preConfiguredObject.description"
        name="description"
      />
      <span>Description</span>
    </div>
    <div :class="['field-wrapper']">
      <label for="tags">Tags: </label>
      <input type="text" v-model.trim="preConfiguredObject.tags" name="tags" />
      <span>Tags</span>
    </div>
    <div :class="['field-wrapper']">
      <label for="distKey">DistKey: </label>
      <input
        type="text"
        v-model.trim="preConfiguredObject.distKey"
        name="distKey"
      />
      <span>distKey</span>
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
    <!-- </div> -->
    <div v-if="accountDetails._internalType._value !== 'CASH'">
      <!-- REQUIRED -->
      <div
        :class="[
          'field-wrapper',
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
          >Credited value</span
        >
        <span v-else-if="!showInfo && validateResult.providerError">{{
          validateResult.providerError
        }}</span>
      </div>
    </div>
    <div v-if="accountDetails._internalType._value === 'BANK_ACCOUNT'">
      <!-- REQUIRED -->
      <div
        :class="[
          'field-wrapper',
          { '--try-danger': !showInfo && validateResult.bookDateError },
        ]"
      >
        <label for="bookDate">Book date: </label>
        <input
          type="text"
          v-model.trim="preConfiguredObject.bookDate"
          name="bookDate"
        />
        <span v-if="showInfo || !validateResult.bookDateError"
          >Credited value</span
        >
        <span v-else-if="!showInfo && validateResult.bookDateError">{{
          validateResult.bookDateError
        }}</span>
      </div>
    </div>
  </div>
  <div v-else-if="showSuccess && !showError">
    <p>Transfer added successful</p>
    <button @click="addMoreTransfers">Add more Transfers</button>
  </div>
  <div v-else-if="showError">
    <p>{{ errorMessage }}</p>
    <button @click="editValues">Give it another try</button>
  </div>
  <button v-if="!showSuccess && !showError" @click="startCreateTransfer">
    <span>Add Transfer</span>
  </button>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  reactive,
  ref,
} from "vue";
import { useTransferCreator } from "./transfer-creator";

import {
  CurrencyValues,
  IBasicAccountClass,
} from "@/interfaces/accounts/accounts";

export default defineComponent({
  name: "AddTransfer",
  props: {
    selectedAccount: {
      type: String,
      required: true,
    },
    accountDetails: {
      type: Object as PropType<IBasicAccountClass>,
      required: true,
    },
  },
  setup(props) {
    onMounted(async () => {
      console.log("accountDetails", props.accountDetails);
      setAccountType(props.accountDetails._internalType._value);
      setAccountDetails(
        props.accountDetails._internalID._value,
        props.accountDetails.accountNumber._value,
        props.accountDetails.provider._value
      );
    });
    const {
      setAccountType,
      setAccountDetails,
      hasErrors,
      preConfiguredObject,
      validateResult,
      createTransfer,
      resetDigitalAccountValues,
      resetBankAccountValues,
      reset,
    } = useTransferCreator();

    const currencies = computed(() => {
      return Object.values(CurrencyValues);
    });

    const showInfo = ref<boolean>(true);

    //Confirmation
    const showSuccess = ref<boolean>(false);
    const showError = ref<boolean>(false);
    const errorMessage = ref<string>("");

    const startCreateTransfer = async () => {
      if (hasErrors()) {
        showInfo.value = false;
        return;
      }
      try {
        const createResult = await createTransfer();
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
    const addMoreTransfers = () => {
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
      currencies,
      startCreateTransfer,
      showInfo,
      showSuccess,
      addMoreTransfers,
      showError,
      errorMessage,
      editValues,
    };
  },
});
</script>

<style lang="scss"></style>
