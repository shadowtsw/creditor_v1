import {
  BasicAccountTypes,
  CurrencyValues,
} from "@/interfaces/accounts/accounts";
import {
  BasicTransfer,
  IBasicTransferConstructorConfig,
  IBasicTransferConstructorKeys,
  TransferValidationResultObject,
} from "@/interfaces/transfers/transfers";
import { useValidator } from "@/utils/validator";
import { computed, reactive, ref } from "vue";
import { convertDate } from "@/utils/date-converter";
import { AccountTransferStore } from "@/store/data/data-store";

export const useTransferCreator = () => {
  const { validString, validNumber, validDate } = useValidator();
  const accountType = ref<BasicAccountTypes>(BasicAccountTypes.CASH);
  const preConfiguredObject = reactive<IBasicTransferConstructorKeys>({
    _internalType: accountType.value,
    shortName: "",
    currency: CurrencyValues.EUR,
    provider: "",
    accountNumber: "",
    value: 0,
    purpose: "",
    description: "",
    tags: [],
    valutaDate: "",
    bookDate: "",
    distKey: {},
    _accountID: "",
  });
  const setAccountType = (payload: BasicAccountTypes) => {
    accountType.value = payload;
    preConfiguredObject._internalType = payload;
  };
  const setAccountDetails = (
    accountID: string,
    accountNo: string,
    provider: string
  ) => {
    preConfiguredObject._accountID = accountID;
    preConfiguredObject.accountNumber = accountNo;
    preConfiguredObject.provider = provider;
  };

  //ErrorMessages
  const errorMessages = {
    STRING: "Must be at least 3 characters",
    NUMBER: "Not a valid number",
    DATE: "Please provide a valid format DD-MM-YYYY",
  };

  //TODO: FROM HERE - NEXT->VALIDATOR
  //Validator
  const validateResult: TransferValidationResultObject = {
    get shortNameError() {
      if (!validString(preConfiguredObject.shortName)) {
        return errorMessages.STRING;
      }
      return null;
    },
    get valueError() {
      if (!validNumber(preConfiguredObject.value)) {
        return errorMessages.NUMBER;
      }
      return null;
    },
    get purposeError() {
      if (!validString(preConfiguredObject.purpose)) {
        return errorMessages.STRING;
      }
      return null;
    },
    get valutaDateError() {
      if (!validDate(preConfiguredObject.valutaDate)) {
        return errorMessages.DATE;
      }
      return null;
    },
    get bookDateError() {
      if (!validDate(preConfiguredObject.bookDate)) {
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
      validationObject: TransferValidationResultObject
    ): boolean => {
      console.log("CASH", validateResult);
      return (
        initialValue ||
        !!validationObject.valueError ||
        !!validationObject.purposeError ||
        !!validationObject.valutaDateError
      );
    };

    const addCashValidation = (
      initialValue: boolean,
      validationObject: TransferValidationResultObject
    ): boolean => {
      return initialValue || !!validationObject.shortNameError;
    };

    const addDigitalAccountValidation = (
      initialValue: boolean,
      validationObject: TransferValidationResultObject
    ): boolean => {
      return (
        initialValue ||
        !!validationObject.providerError ||
        !!validationObject.accountNumberError
      );
    };

    const addBankAccountValidation = (
      initialValue: boolean,
      validationObject: TransferValidationResultObject
    ): boolean => {
      return initialValue || !!validationObject.bookDateError;
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

  const createTransfer = async (): Promise<boolean> => {
    if (hasErrors()) {
      throw new Error("Something is missing, please check inputs !");
    }
    const { valutaDate, bookDate, ...remainingParams } = preConfiguredObject;
    const convertedValutaDate = convertDate(valutaDate);
    const convertedBookDate = convertDate(bookDate);

    if (!convertedValutaDate) {
      throw new Error("Date conversation failed !");
    }

    if (
      preConfiguredObject._internalType !== BasicAccountTypes.CASH &&
      !convertedBookDate
    ) {
      throw new Error("Date conversation failed !");
    }

    const constructorObject: IBasicTransferConstructorConfig = {
      ...remainingParams,
      ...{ _internalType: accountType.value },
      ...{ valutaDate: convertedValutaDate },
      ...{ bookDate: convertedBookDate || "" },
    };

    const newTransfer = new BasicTransfer(constructorObject);

    if (newTransfer._internalID._value !== "") {
      try {
        const issueResult = await AccountTransferStore.commitAddTransfer(
          newTransfer
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
      throw new Error("ID Creation fails, please check Transfer Details");
    }
  };

  const resetDigitalAccountValues = () => {
    preConfiguredObject.provider = "";
    preConfiguredObject.accountNumber = "";
  };

  const resetBankAccountValues = () => {};
  const reset = () => {
    //TODO: remove
    //  _internalID -> constructor only
    //  _internalType //-> will be added
    //  createdAt -> constructor only
    //  updatedAt -> constructor only
    //  isSelected -> constructor only

    preConfiguredObject.value = 0;
    preConfiguredObject.purpose = "";
    preConfiguredObject.valutaDate = "";
    preConfiguredObject.shortName = "";
    preConfiguredObject.description = "";
    preConfiguredObject.tags = [];
    preConfiguredObject.distKey = {};
    preConfiguredObject.currency = CurrencyValues.EUR;

    preConfiguredObject.provider = "";
    preConfiguredObject.accountNumber = "";

    preConfiguredObject.bookDate = "";
  };

  return {
    setAccountType,
    resetDigitalAccountValues,
    resetBankAccountValues,
    preConfiguredObject,
    validateResult,
    getCurrency,
    setCurrency,
    setAccountDetails,
    createTransfer,
    hasErrors,
    reset,
  };
};