import { IBasicTransferClass } from "@/interfaces/transfers/transfers";
import { IBasicAccountClass } from "@/interfaces/accounts/accounts";
export enum RequestEventDataType {
  GET_EXAMPLES = "reqGetExamples",
}

export enum ResponseEventDataType {
  GET_EXAMPLES = "resGetExamples",
}

export interface ExampleWorker {
  examples: (
    accounts: number,
    transfers: number
  ) => Promise<{
    accounts: Array<IBasicAccountClass>;
    transfers: Array<IBasicTransferClass>;
  }>;
  randomNumber: () => Promise<boolean>;
  getTags: Promise<Array<string>>;
}
