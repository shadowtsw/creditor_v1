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
import * as Comlink from "comlink";
import {
  DBProvider as TransferDBProvider,
  IDBTransfers,
} from "@/indexedDB/transfer-database";
import {
  DBProvider as AccountDBProvider,
  IDBAccounts,
} from "@/indexedDB/account-database";
import { openDB } from "idb";
import { upgradeAccountDB } from "@/indexedDB/upgrade-functions/account-db";
import { upgradeTransferDB } from "@/indexedDB/upgrade-functions/transfer-db";
import { Pages } from "@/interfaces/transfers/page-types";

// console.log("HERE IS DEMO WORKER");

const randomNumberGenerator = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const randomValueGenerator = () => {
  let decimal = randomNumberGenerator(5, 99);
  let value = randomNumberGenerator(-1000, 2500);
  return Number(value + "." + decimal);
};

const randomDateGenerator = () => {
  const year = randomNumberGenerator(2001, 2021);
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

let accountDB: Array<IBasicAccountClass> = [];
let transferDB: Array<IBasicTransferClass> = [];
let cachedPagination: Pages = {};

const generateExampleData = async (
  accountAmount: number,
  transfersPerAccount: number
): Promise<boolean> => {
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

      const newTransferConstructorObject: IBasicTransferConstructorConfig = {
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

      const newTransfer = new BasicTransfer(newTransferConstructorObject);

      newAccount.transfers._value.push(newTransfer._internalID._value);
      transferDB.push(newTransfer);
      const currentYearMonth =
        newTransfer.valutaDate._dateMetaInformation.yearmonth;

      if (!cachedPagination.hasOwnProperty(currentYearMonth)) {
        cachedPagination[currentYearMonth] = [];
      }

      cachedPagination[currentYearMonth].push({
        accountID: newTransfer._accountID._value,
        transferID: newTransfer._internalID._value,
        yearMonth: currentYearMonth,
        year: newTransfer.valutaDate._dateMetaInformation.year,
        month: newTransfer.valutaDate._dateMetaInformation.month,
      });
    }
    accountDB.push(newAccount);
  }

  await saveAccounts();
  await saveTransfers();
  await savePagination();

  console.log("Examples generated");

  return Promise.resolve(true);
};

const saveAccounts = async (): Promise<boolean> => {
  const appDatabase = AccountDBProvider.accountsDB;
  const relatedDB = appDatabase.dbDemoName;

  const db = await openDB<IDBAccounts>(relatedDB, appDatabase.currentVersion, {
    upgrade(db) {
      upgradeAccountDB(db);
    },
  });
  if (db) {
    const tx = db.transaction("accounts", "readwrite");
    const promiseArray = [];
    accountDB.forEach((entry) => {
      promiseArray.push(tx.store.add(entry));
    });
    promiseArray.push(tx.done);
    const result = await Promise.all(promiseArray);
    // console.log("STORED ACCOUNT EXAMPLES IN DB", result);
    return Promise.resolve(true);
  } else {
    throw new Error("Failed to add account demo data");
  }
};

const saveTransfers = async (): Promise<boolean> => {
  const appDatabase = TransferDBProvider.transferDB;
  const relatedDB = appDatabase.dbDemoName;

  const db = await openDB<IDBTransfers>(relatedDB, appDatabase.currentVersion, {
    upgrade(db) {
      upgradeTransferDB(db);
    },
  });
  if (db) {
    const tx = db.transaction("transfers", "readwrite");
    const promiseArray = [];
    transferDB.forEach((entry) => {
      promiseArray.push(tx.store.add(entry));
    });
    promiseArray.push(tx.done);
    const result = await Promise.all(promiseArray);
    // console.log("STORED TRANSFER EXAMPLES IN DB", result);
    return Promise.resolve(true);
  } else {
    throw new Error("Failed to add transfer demo data");
  }
};

const savePagination = async (): Promise<boolean> => {
  const appDatabase = TransferDBProvider.transferDB;
  const relatedDB = appDatabase.dbDemoName;

  const db = await openDB<IDBTransfers>(relatedDB, appDatabase.currentVersion, {
    upgrade(db) {
      upgradeTransferDB(db);
    },
  });
  if (db) {
    const tx = db.transaction("pages", "readwrite");
    const promiseArray = [];

    for (const yearmonth in cachedPagination) {
      promiseArray.push(
        tx.store.add({
          yearMonth: Number(yearmonth),
          transfers: cachedPagination[yearmonth],
          year: cachedPagination[yearmonth][0].year,
          month: cachedPagination[yearmonth][0].month,
        })
      );
    }

    promiseArray.push(tx.done);
    const result = await Promise.all(promiseArray);
    // console.log("STORED PAGINATION EXAMPLES IN DB", result);
    //Clean up memory
    cachedPagination = {};
    accountDB = [];
    transferDB = [];
    //Clean up memory
    return Promise.resolve(true);
  } else {
    throw new Error("Failed to add transfer demo data");
  }
};

// const getTransfersFromAccount = (accountID: string) => {
//   // console.log("TRANSFER DB", transferDB, accountID);
//   return (
//     transferDB.filter((entry) => {
//       return entry._accountID._value === accountID;
//     }) || []
//   );
// };

// const addTransfer = (payload: IBasicTransferClass) => {
//   const relatedAccount = accountDB.find((entry) => {
//     return entry._internalID._value === payload._accountID._value;
//   });
//   if (relatedAccount) {
//     transferDB.push(payload);
//     relatedAccount.transfers._value.push(payload._internalID._value);
//   }
// };

const ExampleWorkerObject = {
  generateExampleData: generateExampleData,
  // getTags: tags,
  // getAccounts: accountDB,
  // getTransfers: transferDB,
  // getTransfersFromAccount: getTransfersFromAccount,
  // addTransfer: addTransfer,
};

Comlink.expose(ExampleWorkerObject);
