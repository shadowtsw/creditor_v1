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
import ErrorMessages from "@/utils/error-messages";
import IndexedDBTransferStoreManager from "@/indexedDB/transfer-database";

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

  //TODO: FROM HERE - NEXT->VALIDATOR
  //Validator
  const validateResult: TransferValidationResultObject = {
    get shortNameError() {
      if (!validString(preConfiguredObject.shortName)) {
        return ErrorMessages.STRING;
      }
      return null;
    },
    get currencyError() {
      if (
        !Object.values(CurrencyValues).includes(preConfiguredObject.currency)
      ) {
        return ErrorMessages.STRING;
      }
      return null;
    },
    get valueError() {
      if (!validNumber(preConfiguredObject.value)) {
        return ErrorMessages.NUMBER;
      }
      return null;
    },
    get purposeError() {
      if (!validString(preConfiguredObject.purpose)) {
        return ErrorMessages.STRING;
      }
      return null;
    },
    get valutaDateError() {
      if (!validDate(preConfiguredObject.valutaDate)) {
        return ErrorMessages.DATE;
      }
      return null;
    },
    get bookDateError() {
      if (!validDate(preConfiguredObject.bookDate)) {
        return ErrorMessages.DATE;
      }
      return null;
    },
    get providerError() {
      if (!validString(preConfiguredObject.provider)) {
        return ErrorMessages.STRING;
      }
      return null;
    },
    get accountNumberError() {
      if (!validString(preConfiguredObject.accountNumber)) {
        return ErrorMessages.STRING;
      }
      return null;
    },
  };

  const hasErrors = (): boolean => {
    const addGeneralValidation = (
      initialValue: boolean,
      validationObject: TransferValidationResultObject
    ): boolean => {
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
      preConfiguredObject._internalType === BasicAccountTypes.BANK_ACCOUNT &&
      !convertedBookDate
    ) {
      throw new Error("Date conversation failed !");
    }

    const constructorObject: IBasicTransferConstructorConfig = {
      ...remainingParams,
      ...{ _internalType: accountType.value },
      ...{ valutaDate: convertedValutaDate },
      ...{ bookDate: convertedBookDate || "" },
      ...{ value: Number(remainingParams.value) },
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
          throw new Error("Failed to add transfer !");
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

    // preConfiguredObject.provider = "";
    // preConfiguredObject.accountNumber = "";

    preConfiguredObject.bookDate = "";
  };

  return {
    setAccountType,
    resetDigitalAccountValues,
    resetBankAccountValues,
    preConfiguredObject,
    validateResult,
    // getCurrency,
    // setCurrency,
    setAccountDetails,
    createTransfer,
    hasErrors,
    reset,
  };
};
