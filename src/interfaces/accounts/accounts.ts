import {
  BasicDataField,
  BasicTimeField,
  DataFieldType,
} from "../data-field/data-field-interface";
import { generateCreditorAccountID } from "@/utils/id-generator";
import { getAccountConfig, getYearMonth } from "@/utils/config-generator";

//For DB
export enum DataBases {
  ACCOUNTS = "accounts-database",
  DEMO_ACCOUNTS = "accounts-demo",
}

export enum CurrencyValues {
  EUR = "EUR",
  USD = "USD",
  GBP = "GBP",
}

export enum BasicAccountTypes {
  CASH = "CASH",
  DIGITAL_ACCOUNT = "DIGITAL_ACCOUNT",
  BANK_ACCOUNT = "BANK_ACCOUNT",
}

export type IBasicAccountClassTypes = BasicAccountTypes;

export interface IBasicAccountClass {
  /**
   * !GENERAL -> constructor only
   */
  _internalID: BasicDataField & {
    readonly _value: string;
  };
  // transfers: BasicDataField & {
  //   _value: Array<IBasicTransferClass | string | never>;
  // };
  transfers: BasicDataField & {
    _value: Array<string | never>;
  };
  _internalType: BasicDataField & {
    readonly _value: IBasicAccountClassTypes;
  };
  createdAt: BasicDataField & {
    readonly _value: number;
    _dateMetaInformation: BasicTimeField;
  };
  updatedAt: BasicDataField & {
    _value: number;
    _dateMetaInformation: BasicTimeField;
  };
  isSelected: BasicDataField & {
    _value: boolean;
  };
  /**
   * !
   */

  /**
   * *CASH
   */
  //required
  openingBalance: BasicDataField & {
    _value: number;
  };
  openingBalanceDate: BasicDataField & {
    _value: number;
    _dateMetaInformation: BasicTimeField;
  };
  currency: BasicDataField & {
    _value: CurrencyValues;
  };
  //optional
  shortName: BasicDataField & {
    _value: string;
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
}

export type IBasicAccountFlatMapType<T> = {
  [Property in keyof T]: string | number | CurrencyValues | BasicAccountTypes;
};

type IBasicAccountFilteredClassKeys = Omit<
  IBasicAccountClass,
  | "openingBalanceDate"
  | "accountNumber"
  | "provider"
  | "shortName"
  | "createdAt"
  | "updatedAt"
  | "isSelected"
  | "transfers"
  | "_internalID"
  | "_internalType"
  | "openingBalance"
  | "currency"
>;

export type IBasicAccountConstructorKeys =
  IBasicAccountFlatMapType<IBasicAccountFilteredClassKeys> & {
    openingBalanceDate: string;
    shortName: string;
    provider: string;
    accountNumber: string;
    _internalType: BasicAccountTypes;
    openingBalance: number;
    currency: CurrencyValues;
  };

export type IBasicAccountConstructorConfig =
  IBasicAccountFlatMapType<IBasicAccountFilteredClassKeys> & {
    openingBalanceDate: Date;
    shortName: string;
    provider: string;
    accountNumber: string;
    _internalType: BasicAccountTypes;
    openingBalance: number;
    currency: CurrencyValues;
  };

export class BasicAccount implements IBasicAccountClass {
  _internalID: BasicDataField & { readonly _value: string };
  _internalType: BasicDataField & {
    readonly _value: IBasicAccountClassTypes;
  };
  // _ID: BasicDataField & { readonly _value: string };
  shortName: BasicDataField & { _value: string };
  provider: BasicDataField & {
    readonly _value: string;
  };
  accountNumber: BasicDataField & {
    readonly _value: string;
  };
  // transfers: BasicDataField & {
  //   _value: Array<IBasicTransferClass | string | never>;
  // };
  transfers: BasicDataField & {
    _value: Array<string | never>;
  };
  openingBalance: BasicDataField & {
    _value: number;
  };
  openingBalanceDate: BasicDataField & {
    _value: number;
    _dateMetaInformation: BasicTimeField;
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
  constructor(payload: IBasicAccountConstructorConfig | IBasicAccountClass) {
    if ("_internalID" in payload) {
      this._internalID = payload._internalID;
      this._internalType = payload._internalType;
      this.shortName = payload.shortName;
      this.provider = payload.provider;
      this.accountNumber = payload.accountNumber;
      this.transfers = payload.transfers;
      this.openingBalance = payload.openingBalance;
      this.openingBalanceDate = payload.openingBalanceDate;
      this.createdAt = payload.createdAt;
      this.updatedAt = payload.updatedAt;
      this.currency = payload.currency;
      this.isSelected = payload.isSelected;
    } else {
      (this._internalID = {
        _value: generateCreditorAccountID(payload),
        _type: DataFieldType.ID,
        _displayName: "internalID",
        ...getAccountConfig(payload._internalType, "_internalID"),
      }),
        (this._internalType = {
          _value: payload._internalType,
          _type: DataFieldType.ID,
          _displayName: "internalType",
          ...getAccountConfig(payload._internalType, "_internalType"),
        }),
        (this.shortName = {
          _value: payload.shortName,
          _type: DataFieldType.STRING,
          _displayName: "Shortname",
          ...getAccountConfig(payload._internalType, "shortName"),
        }),
        (this.provider = {
          _value: payload.provider,
          _type: DataFieldType.STRING,
          _displayName: "Bank/Account",
          ...getAccountConfig(payload._internalType, "provider"),
        }),
        (this.accountNumber = {
          _value: payload.accountNumber,
          _type: DataFieldType.STRING,
          _displayName: "IBAN/AccountNo.",
          ...getAccountConfig(payload._internalType, "accountNumber"),
        }),
        (this.transfers = {
          _value: [] as Array<string>,
          _type: DataFieldType.TRANSFERLIST,
          _displayName: "Transfers",
          ...getAccountConfig(payload._internalType, "transfers"),
        }),
        (this.openingBalance = {
          _value: payload.openingBalance || 0,
          _type: DataFieldType.NUMBER,
          _displayName: "Opening balance",
          ...getAccountConfig(payload._internalType, "openingBalance"),
        }),
        (this.openingBalanceDate = {
          _value: payload.openingBalanceDate.getTime(),
          _dateMetaInformation: {
            isoString:
              payload.openingBalanceDate.toISOString() ||
              new Date().toISOString(),
            weekDay: payload.openingBalanceDate.getDay() || new Date().getDay(),
            month:
              payload.openingBalanceDate.getMonth() || new Date().getMonth(),
            year:
              payload.openingBalanceDate.getFullYear() ||
              new Date().getFullYear(),
            yearmonth: payload.openingBalanceDate
              ? getYearMonth(
                  payload.openingBalanceDate.getFullYear(),
                  payload.openingBalanceDate.getMonth()
                )
              : getYearMonth(new Date().getFullYear(), new Date().getMonth()),
          },
          _type: DataFieldType.NUMBER,
          _displayName: "Opening balance date",
          ...getAccountConfig(payload._internalType, "openingBalanceDate"),
        }),
        (this.createdAt = {
          _value: new Date().getTime(),
          _dateMetaInformation: {
            isoString: new Date().toISOString(),
            weekDay: new Date().getDay(),
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            yearmonth: getYearMonth(
              new Date().getFullYear(),
              new Date().getMonth()
            ),
          },
          _type: DataFieldType.NUMBER,
          _displayName: "Created at",
          ...getAccountConfig(payload._internalType, "createdAt"),
        }),
        (this.updatedAt = {
          _value: new Date().getTime() || new Date().getTime(),
          _dateMetaInformation: {
            isoString: new Date().toISOString() || new Date().toISOString(),
            weekDay: new Date().getDay() || new Date().getDay(),
            month: new Date().getMonth() || new Date().getMonth(),
            year: new Date().getFullYear() || new Date().getFullYear(),
            yearmonth: getYearMonth(
              new Date().getFullYear(),
              new Date().getMonth()
            ),
          },
          _type: DataFieldType.NUMBER,
          _displayName: "Updated at",
          ...getAccountConfig(payload._internalType, "updatedAt"),
        }),
        (this.currency = {
          _value: payload.currency,
          _type: DataFieldType.CURRENCY,
          _displayName: "Currency",
          ...getAccountConfig(payload._internalType, "currency"),
        }),
        (this.isSelected = {
          _value: true,
          _type: DataFieldType.CHECKBOX,
          _displayName: "Selected",
          ...getAccountConfig(payload._internalType, "isSelected"),
        });
    }
  }
}

export interface AccountTransferValidationResultObject {
  shortNameError: string | null;
  currencyError: string | null;
  openingBalanceError: string | null;
  openingBalanceDateError: string | null;
  providerError: string | null;
  accountNumberError: string | null;
}
