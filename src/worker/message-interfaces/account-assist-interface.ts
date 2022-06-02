export interface BasicAccountAssistMessage {
  topic: {
    type: any;
  };
}

export enum AccountAssistMessageTypes {
  INIT = "INIT",
  REQUEST_CALC = "REQUEST_CALC",
}

export interface SubscriptionObject {
  id: string;
  callback: Function;
}
export type Subscriptions = {
  ["REQUEST_CALC"]: Array<SubscriptionObject | never>;
};

export enum InitMessageTargets {
  TRANSFER_DB = "transferDB",
  ACCOUNT_DB = "accountDB",
}

export interface InitMessage extends BasicAccountAssistMessage {
  topic: {
    type: AccountAssistMessageTypes.INIT;
    target: InitMessageTargets;
  };
}

export interface RequestBalanceMessage extends BasicAccountAssistMessage {
  topic: {
    type: AccountAssistMessageTypes.REQUEST_CALC;
    accountID: string;
  };
}

export interface ResponseBalanceMessage extends BasicAccountAssistMessage {
  topic: {
    type: AccountAssistMessageTypes.REQUEST_CALC;
    accountID: string;
  };
  data: AccountBalanceObject;
}

export type MessageGroups = InitMessage | RequestBalanceMessage;

export interface SingleBalanceObject {
  balance: number;
  income: number;
  outgoing: number;
}

export interface AccountBalanceObject {
  lastMonth: SingleBalanceObject;
  currentMonth: SingleBalanceObject;
}

export interface MonthBalanceObject {
  [index: number]: SingleBalanceObject;
}

export interface YearMonthBalanceObject {
  [index: number]: MonthBalanceObject;
}
