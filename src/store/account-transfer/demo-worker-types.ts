import { IBasicTransferClass } from "@/interfaces/transfers/transfers";
import { IBasicAccountClass } from "@/interfaces/accounts/accounts";
export enum RequestEventDataType {
  GET_EXAMPLES = "reqGetExamples",
}

export enum ResponseEventDataType {
  GET_EXAMPLES = "resGetExamples",
}

export interface ExampleWorker {
  generateExampleData: (
    accounts: number,
    transfers: number
  ) => Promise<boolean>;
  // randomNumber: () => Promise<boolean>;
  getTags: Promise<Array<string>>;
  getAccounts: Promise<Array<IBasicAccountClass>>;
  getTransfers: Promise<Array<IBasicTransferClass>>;
  getTransfersFromAccount: (
    accountID: string
  ) => Promise<Array<IBasicTransferClass | never>>;
  addTransfer: (payload: IBasicTransferClass) => void;
}
