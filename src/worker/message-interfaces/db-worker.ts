export enum InitMessageTypes {
  INIT = "init",
}

export enum InitMessageTargets {
  TRANSFER_DB = "transferDB",
  ACCOUNT_DB = "accountDB",
}

export interface InitMessage {
  topic: {
    type: InitMessageTypes;
    target: InitMessageTargets;
  };
}

export interface AccountCalcData {
  lastMonth: {
    balance: number;
    income: number;
    outgoing: number;
  };
  currentMonth: {
    balance: number;
    income: number;
    outgoing: number;
  };
}
