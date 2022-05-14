import {
  AccountTransferValidationResultObject,
  BasicAccount,
  BasicAccountTypes,
  CurrencyValues,
  IBasicAccountConstructorConfig,
  IBasicAccountConstructorKeys,
} from "@/interfaces/accounts/accounts";
import { AccountTransferStore } from "@/store/data/data-store";
import { generateCreditorAccountID } from "@/utils/id-generator";
import { useValidator } from "@/utils/validator";
import { computed, reactive, ref } from "vue";
import { convertDate } from "@/utils/date-converter";

export const useAccountCreator = () => {
  const { validString, validNumber, validDate } = useValidator();

  const accountType = ref<BasicAccountTypes>(BasicAccountTypes.CASH);

  const setAccountType = (payload: BasicAccountTypes) => {
    accountType.value = payload;
    preConfiguredObject._internalType = payload;
  };

  const preConfiguredObject = reactive<IBasicAccountConstructorKeys>({
    _internalType: accountType.value,
    shortName: "",
    openingBalance: 0,
    openingBalanceDate: "",
    currency: CurrencyValues.EUR,
    provider: "",
    accountNumber: "",
  });

  //ErrorMessages
  const errorMessages = {
    STRING: "Must be at least 3 characters",
    NUMBER: "Not a valid number",
    DATE: "Please provide a valid format DD-MM-YYYY",
  };

  //Validator
  const validateResult: AccountTransferValidationResultObject = {
    get shortNameError() {
      if (!validString(preConfiguredObject.shortName)) {
        return errorMessages.STRING;
      }
      return null;
    },
    get openingBalanceError() {
      if (!validNumber(preConfiguredObject.openingBalance)) {
        return errorMessages.NUMBER;
      }
      return null;
    },
    get openingBalanceDateError() {
      if (!validDate(preConfiguredObject.openingBalanceDate)) {
        return errorMessages.DATE;
      }
      return null;
    },
    get providerError() {
      if (!validString(preConfiguredObject.provider)) {
        return errorMessages.STRING;
      }
      return null;
    },
    get accountNumberError() {
      if (!validString(preConfiguredObject.accountNumber)) {
        return errorMessages.STRING;
      }
      return null;
    },
  };

  //Currency
  const currency = ref<CurrencyValues>(CurrencyValues.EUR);
  const getCurrency = computed(() => {
    return currency.value;
  });
  const setCurrency = (payload: CurrencyValues) => {
    currency.value = payload;
  };

  const hasErrors = (): boolean => {
    const addGeneralValidation = (
      initialValue: boolean,
      validationObject: AccountTransferValidationResultObject
    ): boolean => {
      return initialValue;
    };

    const addCashValidation = (
      initialValue: boolean,
      validationObject: AccountTransferValidationResultObject
    ): boolean => {
      return (
        initialValue ||
        !!validationObject.openingBalanceError ||
        !!validationObject.openingBalanceDateError
      );
    };

    const addDigitalAccountValidation = (
      initialValue: boolean,
      validationObject: AccountTransferValidationResultObject
    ): boolean => {
      return (
        initialValue ||
        !!validationObject.providerError ||
        !!validationObject.accountNumberError
      );
    };

    const addBankAccountValidation = (
      initialValue: boolean,
      validationObject: AccountTransferValidationResultObject
    ): boolean => {
      return initialValue;
    };

    let basicValidation = false;

    basicValidation = addGeneralValidation(basicValidation, validateResult);

    switch (preConfiguredObject._internalType) {
      case BasicAccountTypes.CASH:
        basicValidation = addCashValidation(basicValidation, validateResult);
        break;
      case BasicAccountTypes.DIGITAL_ACCOUNT:
        basicValidation = addCashValidation(basicValidation, validateResult);
        basicValidation = addDigitalAccountValidation(
          basicValidation,
          validateResult
        );
        break;
      case BasicAccountTypes.BANK_ACCOUNT:
        basicValidation = addCashValidation(basicValidation, validateResult);
        basicValidation = addDigitalAccountValidation(
          basicValidation,
          validateResult
        );
        basicValidation = addBankAccountValidation(
          basicValidation,
          validateResult
        );
        break;
    }

    return basicValidation;
  };

  const createAccount = async (): Promise<boolean> => {
    if (hasErrors()) {
      throw new Error("Something is missing, please check inputs !");
    }

    const { openingBalanceDate, ...remainingParams } = preConfiguredObject;
    const convertedOPDate = convertDate(openingBalanceDate);

    if (!convertedOPDate) {
      throw new Error("Date conversation failed !");
    }

    const constructorObject: IBasicAccountConstructorConfig = {
      ...remainingParams,
      ...{ openingBalanceDate: convertedOPDate },
    };

    const newAccount = new BasicAccount(constructorObject);

    if (newAccount._internalID._value !== "") {
      try {
        const issueResult = await AccountTransferStore.commitAddAccount(
          newAccount
        );
        if (issueResult) {
          reset();
          return Promise.resolve(true);
        } else {
          return Promise.reject(new Error("Something went wrong"));
        }
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      throw new Error("ID Creation fails, please check Account Details");
    }
  };

  const resetDigitalAccountValues = () => {
    preConfiguredObject.provider = "";
    preConfiguredObject.accountNumber = "";
  };

  const resetBankAccountValues = () => {};
  //TODO: note o different account types
  const reset = () => {
    //  _internalID -> constructor only
    //  transfers //-> constructor only
    //  _internalType //-> will be added
    //  createdAt -> constructor only
    //  updatedAt -> constructor only
    //  isSelected -> constructor only

    preConfiguredObject.openingBalance = 0;
    preConfiguredObject.openingBalanceDate = "";
    preConfiguredObject.currency = CurrencyValues.EUR;
    preConfiguredObject.shortName = "";

    preConfiguredObject.provider = "";
    preConfiguredObject.accountNumber = "";
  };

  return {
    setAccountType,
    resetDigitalAccountValues,
    resetBankAccountValues,
    preConfiguredObject,
    validateResult,
    getCurrency,
    setCurrency,
    createAccount,
    hasErrors,
    reset,
  };
};