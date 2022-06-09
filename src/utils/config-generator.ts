import {
  BasicAccountTypes,
  IBasicAccountClass,
  IBasicAccountFlatMapType,
} from "@/interfaces/accounts/accounts";
import {
  BasicDataField,
  BasicTimeField,
} from "@/interfaces/data-field/data-field-interface";
import {
  IBasicTransferClass,
  IBasicTransferConstructorConfig,
  IBasicTransferFlatMapType,
} from "@/interfaces/transfers/transfers";

type CombinedConfigFields = BasicDataField & BasicTimeField;

type TransferFieldConfigFlatMap<T> = {
  [Property in keyof T]: number | boolean;
};

type BasicTransferConfigFields =
  TransferFieldConfigFlatMap<CombinedConfigFields>;
type FieldKey = keyof BasicTransferConfigFields & "_value";

/**
 * Setup for account specific configs and visibility
 */
//TODO define basic configs
export const getTransferConfig = (
  type: BasicAccountTypes,
  property: keyof IBasicTransferFlatMapType<IBasicTransferClass>
): Omit<BasicDataField, "_displayName" | "_type"> => {
  if (type === BasicAccountTypes.CASH) {
    switch (property) {
      case "_internalID":
      case "_internalType":
      case "_accountID":
        return {
          _visible: false,
          _readonly: true,
          _shared: false,
        };
      case "createdAt":
        return {
          _visible: true,
          _readonly: true,
          _shared: false,
        };
      case "updatedAt":
      case "isSelected":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "value":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "purpose":
      case "shortName":
      case "description":
      case "tags":
      case "distKey":
      case "currency":
        return {
          _visible: true,
          _readonly: false,
          _shared: true,
        };
      case "provider":
      case "accountNumber":
        return {
          _visible: false,
          _readonly: true,
          _shared: false,
        };
      default:
        throw new Error("Property doesn't exist");
    }
  } else if (type === BasicAccountTypes.DIGITAL_ACCOUNT) {
    //TODO: define props
    switch (property) {
      case "_internalID":
      case "_internalType":
      case "_accountID":
        return {
          _visible: false,
          _readonly: true,
          _shared: false,
        };
      case "createdAt":
        return {
          _visible: true,
          _readonly: true,
          _shared: false,
        };
      case "updatedAt":
      case "isSelected":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "value":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "purpose":
      case "shortName":
      case "description":
      case "tags":
      case "distKey":
      case "currency":
        return {
          _visible: true,
          _readonly: false,
          _shared: true,
        };
      case "provider":
      case "accountNumber":
        return {
          _visible: false,
          _readonly: true,
          _shared: false,
        };
      default:
        throw new Error("Property doesn't exist");
    }
  } else if (type === BasicAccountTypes.BANK_ACCOUNT) {
    //TODO: define props
    switch (property) {
      case "_internalID":
      case "_internalType":
      case "_accountID":
        return {
          _visible: false,
          _readonly: true,
          _shared: false,
        };
      case "createdAt":
        return {
          _visible: true,
          _readonly: true,
          _shared: false,
        };
      case "updatedAt":
      case "isSelected":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "value":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "purpose":
      case "shortName":
      case "description":
      case "tags":
      case "distKey":
      case "currency":
        return {
          _visible: true,
          _readonly: false,
          _shared: true,
        };
      case "provider":
      case "accountNumber":
        return {
          _visible: false,
          _readonly: true,
          _shared: false,
        };
      default:
        throw new Error("Property doesn't exist");
    }
  } else {
    throw new Error("Unknown account type, please check parameters !");
  }
};

export const getAccountConfig = (
  type: BasicAccountTypes,
  property: keyof IBasicAccountFlatMapType<IBasicAccountClass>
): Omit<BasicDataField, "_displayName" | "_type"> => {
  if (type === BasicAccountTypes.CASH) {
    switch (property) {
      case "_internalID":
      case "_internalType":
        return {
          _visible: false,
          _readonly: true,
          _shared: false,
        };
      case "transfers":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "createdAt":
        return {
          _visible: true,
          _readonly: true,
          _shared: false,
        };
      case "updatedAt":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "isSelected":
        return {
          _visible: false,
          _readonly: false,
          _shared: false,
        };
      case "openingBalance":
      case "openingBalanceDate":
      case "shortName":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "currency":
        return {
          _visible: true,
          _readonly: true,
          _shared: false,
        };
      case "provider":
      case "accountNumber":
        return {
          _visible: false,
          _readonly: true,
          _shared: false,
        };
      default:
        throw new Error("Property doesn't exist");
    }
  } else if (type === BasicAccountTypes.DIGITAL_ACCOUNT) {
    //TODO: define props
    switch (property) {
      case "_internalID":
      case "_internalType":
        return {
          _visible: false,
          _readonly: true,
          _shared: false,
        };
      case "transfers":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "createdAt":
        return {
          _visible: true,
          _readonly: true,
          _shared: false,
        };
      case "updatedAt":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "isSelected":
        return {
          _visible: false,
          _readonly: false,
          _shared: false,
        };
      case "openingBalance":
      case "openingBalanceDate":
      case "shortName":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "currency":
        return {
          _visible: true,
          _readonly: true,
          _shared: false,
        };
      case "provider":
      case "accountNumber":
        return {
          _visible: false,
          _readonly: true,
          _shared: false,
        };
      default:
        throw new Error("Property doesn't exist");
    }
  } else if (type === BasicAccountTypes.BANK_ACCOUNT) {
    //TODO: define props
    switch (property) {
      case "_internalID":
      case "_internalType":
        return {
          _visible: false,
          _readonly: true,
          _shared: false,
        };
      case "transfers":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "createdAt":
        return {
          _visible: true,
          _readonly: true,
          _shared: false,
        };
      case "updatedAt":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "isSelected":
        return {
          _visible: false,
          _readonly: false,
          _shared: false,
        };
      case "openingBalance":
      case "openingBalanceDate":
      case "shortName":
        return {
          _visible: true,
          _readonly: false,
          _shared: false,
        };
      case "currency":
        return {
          _visible: true,
          _readonly: true,
          _shared: false,
        };
      case "provider":
      case "accountNumber":
        return {
          _visible: false,
          _readonly: true,
          _shared: false,
        };
      default:
        throw new Error("Property doesn't exist");
    }
  } else {
    throw new Error("Unknown account type, please check parameters !");
  }
};

export const getYearMonth = (year: number, month: number) => {
  let newMonth = month.toString();
  if (newMonth.length === 1) {
    newMonth = "0" + newMonth;
  }
  const yearMonthString = year.toString() + newMonth;
  return Number(yearMonthString);
};
