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
}
