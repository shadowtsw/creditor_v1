import {
  BasicAccount,
  BasicAccountTypes,
  CurrencyValues,
  IBasicAccountClass,
  IBasicAccountConstructorConfig,
} from "@/interfaces/accounts/accounts";
import {
  BasicTransfer,
  IBasicTransferClass,
  IBasicTransferConstructorConfig,
} from "@/interfaces/transfers/transfers";
import { DataFieldType } from "@/interfaces/data-field/data-field-interface";
import * as Comlink from "comlink";
import { getTransferConfig } from "@/utils/config-generator";
import { ExampleWorker } from "./demo-worker-types";

console.log("HERE IS DEMO WORKER");

const randomNumberGenerator = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const randomValueGenerator = () => {
  let decimal = randomNumberGenerator(5, 99);
  let value = randomNumberGenerator(5, 1800);
  return Number(value + "." + decimal);
};

const randomDateGenerator = () => {
  const year = randomNumberGenerator(2017, 2021);
  const month = randomNumberGenerator(0, 11);
  const day =
    month !== 1 ? randomNumberGenerator(0, 30) : randomNumberGenerator(0, 28);

  const returnDate = new Date(year, month, day);

  return returnDate;
};

const tags = [
  "Food",
  "Insurance",
  "Car",
  "Economy-Costs",
  "Garden",
  "Hobby",
  "Cash",
  "Party",
  "Non-Food",
  "Electronics",
  "Shoes",
  "Clothes",
  "Friends",
  "Birthday",
];
const randomTagsGenerator = () => {
  const amountOfTags = randomNumberGenerator(0, 4);
  const arrayOfTags: Set<string | never> = new Set();

  if (amountOfTags === 0) {
    return [];
  }

  for (let i = 0; i <= amountOfTags; i++) {
    const index = randomNumberGenerator(0, tags.length - 1);
    arrayOfTags.add(tags[index]);
  }

  return Array.from(arrayOfTags.keys());
};

const randomDistKeyGenerator = () => {
  const distKeys = [
    { "House": { electrical: 40, garbage: 10, winter: 10, water: 40 } },
  ];

  return distKeys[0];
};

const accountDB: Array<IBasicAccountClass> = [];
const transferDB: Array<IBasicTransferClass> = [];

const generateExampleData = (
  accountAmount: number,
  transfersPerAccount: number
): Promise<boolean> => {
  // const parsedAccountArray = [];
  // const transferArray = [];

  for (let i = 0; i < accountAmount; i++) {
    const accountTypeValue = BasicAccountTypes.CASH;
    const accountID = "account-" + i.toString();
    const accountNumber = (i * i).toString();
    const provider = "SPK" + i.toString();
    const accountShortname = `DummyCash-${i}`;

    const newAccountConstructorObject: IBasicAccountConstructorConfig = {
      _internalType: accountTypeValue,
      provider: provider,
      accountNumber: accountNumber,
      shortName: accountShortname,
      openingBalance: randomNumberGenerator(50, 2500),
      openingBalanceDate: new Date(),
      currency: CurrencyValues.EUR,
    };

    const newAccount = new BasicAccount(newAccountConstructorObject);

    for (let j = 0; j < transfersPerAccount; j++) {
      const bookDate = randomDateGenerator();
      const valutaDate = randomDateGenerator();

      const newTransferContructorObject: IBasicTransferConstructorConfig = {
        _internalType: accountTypeValue,
        shortName: "",
        currency: CurrencyValues.EUR,

        provider: provider,
        accountNumber: accountNumber,

        value: randomValueGenerator(),

        purpose: (i * i).toString(),
        description: "Demo" + "-" + j + "-" + i,

        tags: randomTagsGenerator(),
        valutaDate: valutaDate,
        bookDate: "",
        distKey: randomDistKeyGenerator(),
        _accountID: newAccount._internalID._value,
      };

      const newTransfer = new BasicTransfer(newTransferContructorObject);

      newAccount.transfers._value.push(newTransfer._internalID._value);
      transferDB.push(newTransfer);
    }
    accountDB.push(newAccount);
  }

  console.log("Examples generated");
  // console.log("AccountsDB", accountDB);
  // console.log("TransfersDB",transferDB);
  return Promise.resolve(true);
};

const getTransfersFromAccount = (accountID: string) => {
  // console.log("TRANSFER DB", transferDB, accountID);
  return (
    transferDB.filter((entry) => {
      return entry._accountID._value === accountID;
    }) || []
  );
};

const addTransfer = (payload: IBasicTransferClass) => {
  const relatedAccount = accountDB.find((entry) => {
    return entry._internalID._value === payload._accountID._value;
  });
  if (relatedAccount) {
    transferDB.push(payload);
    relatedAccount.transfers._value.push(payload._internalID._value);
  }
};

const ExampleWorkerObject: {
  generateExampleData: (
    accounts: number,
    transfers: number
  ) => Promise<boolean>;
  getTags: Array<string>;
  getAccounts: Array<IBasicAccountClass>;
  getTransfers: Array<IBasicTransferClass>;
  getTransfersFromAccount: (
    accountID: string
  ) => Array<IBasicTransferClass | never>;
  addTransfer: (payload: IBasicTransferClass) => void;
} = {
  generateExampleData: generateExampleData,
  getTags: tags,
  getAccounts: accountDB,
  getTransfers: transferDB,
  getTransfersFromAccount: getTransfersFromAccount,
  addTransfer: addTransfer,
};

Comlink.expose(ExampleWorkerObject);
