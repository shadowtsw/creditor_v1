import { getTransferConfig } from "@/utils/config-generator";
import { generateCreditorTransferID } from "@/utils/id-generator";
import {
  BasicAccountTypes,
  CurrencyValues,
  IBasicAccountClassTypes,
} from "../accounts/accounts";
import {
  BasicDataField,
  BasicTimeField,
  DataFieldType,
} from "../data-field/data-field-interface";

export type DistributionKey =
  | { [index: string]: { [index: string]: number } }
  | {};

export interface IBasicTransferClass {
  /**
   * !GENERAL -> constructor only
   */
  _internalID: BasicDataField & {
    readonly _value: string; //-> constructor only
  };
  _internalType: BasicDataField & {
    readonly _value: BasicAccountTypes; //-> will be added
  };
  createdAt: BasicDataField & {
    readonly _value: number;
    readonly _dateMetaInformation: BasicTimeField;
  };
  updatedAt: BasicDataField & {
    _value: number;
    _dateMetaInformation: BasicTimeField;
  };
  isSelected: BasicDataField & {
    _value: boolean;
  };
  _accountID: BasicDataField & {
    readonly _value: string;
  };
  /**
   * !
   */

  /**
   * *CASH
   */
  //required
  value: BasicDataField & {
    _value: number;
  };
  purpose: BasicDataField & {
    _value: string;
  };
  valutaDate: BasicDataField & {
    _value: number;
    _dateMetaInformation: BasicTimeField;
  };
  //optional
  shortName: BasicDataField & {
    _value: string;
  };
  description: BasicDataField & {
    _value: string;
  };
  tags: BasicDataField & {
    _value: Array<string>;
  };
  distKey: BasicDataField & {
    _value: DistributionKey;
  };
  currency: BasicDataField & {
    _value: CurrencyValues;
  };
  /**
   * *
   */

  /**
   * *DIGITAL
   */
  provider: BasicDataField & {
    readonly _value: string;
  }; //Host, bank, cash etc...
  accountNumber: BasicDataField & {
    readonly _value: string;
  }; //Iban, account-id etc...
  /**
   * *
   */

  /**
   * *BANK_ACCOUNT
   */
  bookDate: BasicDataField & {
    _value: number;
    _dateMetaInformation: BasicTimeField;
  };
  /**
   * *
   */
}

export type IBasicTransferFlatMapType<T> = {
  [Property in keyof T]: string | number | CurrencyValues | DistributionKey;
};

type IBasicTransferFilteredClassKeys = Omit<
  IBasicTransferClass,
  | "accountNumber"
  | "_accountID"
  | "value"
  | "purpose"
  | "provider"
  | "updatedAt"
  | "distKey"
  | "createdAt"
  | "isSelected"
  | "_internalID"
  | "_shortName"
  | "currency"
  | "valutaDate"
  | "bookDate"
  | "tags"
>;

export type IBasicTransferConstructorKeys =
  IBasicTransferFlatMapType<IBasicTransferFilteredClassKeys> & {
    // openingBalanceDate: string;
    shortName: string;
    currency: CurrencyValues;
    tags: Array<string | never>;
    distKey: DistributionKey;
    provider: string;
    accountNumber: string;
    purpose: string;
    valutaDate: string;
    bookDate: string;
    value: number;
    description: string;
    _accountID: string;
  };

export type IBasicTransferConstructorConfig =
  IBasicTransferFlatMapType<IBasicTransferFilteredClassKeys> & {
    // openingBalanceDate: Date;
    _internalType: IBasicAccountClassTypes;
    shortName: string;
    currency: CurrencyValues;
    tags: Array<string | never>;
    distKey: DistributionKey;
    provider: string;
    accountNumber: string;
    purpose: string;
    valutaDate: Date;
    bookDate: Date | "";
    value: number;
    description: string;
    _accountID: string;
  };

export class BasicTransfer implements IBasicTransferClass {
  _internalID: BasicDataField & { readonly _value: string };
  _internalType: BasicDataField & {
    readonly _value: IBasicAccountClassTypes;
  };
  _accountID: BasicDataField & {
    readonly _value: string;
  };
  // _ID: BasicDataField & { readonly _value: string };
  shortName: BasicDataField & { _value: string };
  value: BasicDataField & {
    _value: number;
  };
  purpose: BasicDataField & {
    _value: string;
  };
  valutaDate: BasicDataField & {
    _value: number;
    _dateMetaInformation: BasicTimeField;
  };
  provider: BasicDataField & {
    readonly _value: string;
  };
  accountNumber: BasicDataField & {
    readonly _value: string;
  };
  bookDate: BasicDataField & {
    _value: number;
    _dateMetaInformation: BasicTimeField;
  };
  description: BasicDataField & {
    _value: string;
  };
  tags: BasicDataField & {
    _value: Array<string>;
  };
  distKey: BasicDataField & {
    _value: DistributionKey;
  };
  createdAt: BasicDataField & {
    _value: number;
    _dateMetaInformation: BasicTimeField;
  };
  updatedAt: BasicDataField & {
    _value: number;
    _dateMetaInformation: BasicTimeField;
  };
  currency: BasicDataField & {
    _value: CurrencyValues;
  };
  isSelected: BasicDataField & {
    _value: boolean;
  };
  constructor(payload: IBasicTransferConstructorConfig) {
    console.log("IBasicTransferConstructorConfig", payload);
    (this._internalID = {
      _value: generateCreditorTransferID(payload),
      _displayName: "internalID",
      _type: DataFieldType.ID,
      ...getTransferConfig(payload._internalType, "_internalID"),
    }),
      (this._internalType = {
        _value: payload._internalType,
        _displayName: "internalType",
        _type: DataFieldType.ID,
        ...getTransferConfig(payload._internalType, "_internalType"),
      }),
      (this._accountID = {
        _value: payload._accountID,
        _displayName: "accountID",
        _type: DataFieldType.ID,
        ...getTransferConfig(payload._internalType, "_accountID"),
      }),
      (this.shortName = {
        _value: payload.shortName,
        _type: DataFieldType.STRING,
        _displayName: "Shortname",
        ...getTransferConfig(payload._internalType, "shortName"),
      }),
      (this.value = {
        _value: payload.value,
        _type: DataFieldType.NUMBER,
        _displayName: "Value",
        ...getTransferConfig(payload._internalType, "value"),
      }),
      (this.purpose = {
        _value: payload.purpose,
        _type: DataFieldType.STRING,
        _displayName: "Purpose",
        ...getTransferConfig(payload._internalType, "purpose"),
      }),
      (this.valutaDate = {
        _value: payload.valutaDate.getTime(),
        _dateMetaInformation: {
          isoString: payload.valutaDate.toISOString(),
          weekDay: payload.valutaDate.getDay(),
          month: payload.valutaDate.getMonth(),
          year: payload.valutaDate.getFullYear(),
        },
        _type: DataFieldType.NUMBER,
        _readonly: false,
        _visible: payload.valutaDate ? true : false,
        _shared: false,
        _displayName: "Opening balance date",
      }),
      (this.provider = {
        _value: payload.provider,
        _type: DataFieldType.STRING,
        _displayName:
          payload._internalType === BasicAccountTypes.CASH
            ? "Provider"
            : "Bank/Account",
        ...getTransferConfig(payload._internalType, "provider"),
      }),
      (this.accountNumber = {
        _value: payload.accountNumber,
        _type: DataFieldType.STRING,
        _displayName:
          payload._internalType === BasicAccountTypes.CASH
            ? "Email/Account"
            : "IBAN/AccountNo.",
        ...getTransferConfig(payload._internalType, "accountNumber"),
      }),
      (this.bookDate = {
        _value:
          payload.bookDate === ""
            ? payload.valutaDate.getTime()
            : payload.bookDate.getTime(),
        _dateMetaInformation: {
          isoString:
            payload.bookDate === ""
              ? payload.valutaDate.toISOString()
              : payload.bookDate.toISOString(),
          weekDay:
            payload.bookDate === ""
              ? payload.valutaDate.getDay()
              : payload.bookDate.getDay(),
          month:
            payload.bookDate === ""
              ? payload.valutaDate.getMonth()
              : payload.bookDate.getMonth(),
          year:
            payload.bookDate === ""
              ? payload.valutaDate.getFullYear()
              : payload.bookDate.getFullYear(),
        },
        _type: DataFieldType.NUMBER,
        _readonly: false,
        _visible: payload.bookDate ? true : false,
        _shared: false,
        _displayName: "Date of booking",
      }),
      (this.description = {
        _value: payload.description,
        _type: DataFieldType.STRING,
        _displayName: "Description",
        ...getTransferConfig(payload._internalType, "description"),
      }),
      (this.tags = {
        _value: payload.tags,
        _type: DataFieldType.TAGLIST,
        _displayName: "Tags",
        ...getTransferConfig(payload._internalType, "tags"),
      }),
      (this.distKey = {
        _value: payload.distKey,
        _type: DataFieldType.KEYOBJECT,
        _displayName: "Distribution Keys",
        ...getTransferConfig(payload._internalType, "distKey"),
      }),
      (this.createdAt = {
        _value: new Date().getTime(),
        _dateMetaInformation: {
          isoString: new Date().toISOString(),
          weekDay: new Date().getDay(),
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        },
        _type: DataFieldType.NUMBER,
        _readonly: true,
        _visible: true,
        _shared: true,
        _displayName: "Created at",
      }),
      (this.updatedAt = {
        _value: new Date().getTime(),
        _dateMetaInformation: {
          isoString: new Date().toISOString(),
          weekDay: new Date().getDay(),
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        },
        _type: DataFieldType.NUMBER,
        _readonly: false,
        _visible: true,
        _shared: true,
        _displayName: "Updated at",
      }),
      (this.currency = {
        _value: payload.currency,
        _type: DataFieldType.CURRENCY,
        _displayName: "Currency",
        ...getTransferConfig(payload._internalType, "currency"),
      }),
      (this.isSelected = {
        _value: false,
        _type: DataFieldType.CHECKBOX,
        _displayName: "Selected",
        ...getTransferConfig(payload._internalType, "isSelected"),
      });
  }
}

export interface TransferValidationResultObject {
  shortNameError: string | null;
  valueError: string | null;
  purposeError: string | null;
  valutaDateError: string | null;
  bookDateError: string | null;
  providerError: string | null;
  accountNumberError: string | null;
  currencyError: string | null;
}
