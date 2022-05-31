import {
  upgradeAccountDB,
  accountDBSchema,
} from "@/indexedDB/upgrade-functions/account-db";
import {
  transferDBSchema,
  upgradeTransferDB,
} from "@/indexedDB/upgrade-functions/transfer-db";
import { IBasicTransferClass } from "@/interfaces/transfers/transfers";
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from "idb";
import {
  DBProvider as AccountProvider,
  IDBAccounts,
} from "../indexedDB/account-database";
import {
  DBProvider as TransferProvider,
  IDBTransfers,
} from "../indexedDB/transfer-database";
import {
  AccountCalcData,
  InitMessage,
  InitMessageTargets,
  InitMessageTypes,
} from "./message-interfaces/db-worker";

let accountDB: accountDBSchema;
let transferDB: transferDBSchema;

const openAccountDB = async (): Promise<boolean> => {
  const db = await openDB<IDBAccounts>(
    AccountProvider.accountsDB.dbname,
    AccountProvider.accountsDB.currentVersion,
    {
      upgrade(db) {
        upgradeAccountDB(db);
      },
    }
  );

  if (db) {
    accountDB = db;
    return Promise.resolve(true);
  } else {
    return Promise.reject(new Error("Failed to work accountDB inside Worker"));
  }
};

const openTransferDB = async (): Promise<boolean> => {
  const db = await openDB<IDBTransfers>(
    TransferProvider.transferDB.dbname,
    TransferProvider.transferDB.currentVersion,
    {
      upgrade(db) {
        upgradeTransferDB(db);
      },
    }
  );

  if (db) {
    transferDB = db;
    return Promise.resolve(true);
  } else {
    return Promise.reject(new Error("Failed to work transferDB inside Worker"));
  }
};

type GlobalMessageObject = InitMessage;

self.addEventListener("message", async (event: MessageEvent) => {
  if (!accountDB) {
    try {
      await openAccountDB();
    } catch (err) {
      console.log(err);
    }
  }
  if (!transferDB) {
    try {
      await openTransferDB();
    } catch (err) {
      console.log(err);
    }
  }
  if (event.data) {
    const message = event.data as GlobalMessageObject;

    if (
      message.topic &&
      message.topic.type &&
      message.topic.type === InitMessageTypes.INIT
    ) {
      switch (message.topic.target) {
        case InitMessageTargets.ACCOUNT_DB:
          await openAccountDB();
          break;
        case InitMessageTargets.TRANSFER_DB:
          await openTransferDB();
          break;
        default:
          throw new Error("Message target not found");
          break;
      }
    }

    if (event.data.calc) {
      let relatedTransfers = [] as Array<
        string | IBasicTransferClass | undefined
      >;
      let account = null;

      account = await accountDB.get("accounts", event.data.targetAccount);

      if (account) {
        account.transfers._value.forEach((entry) => {
          relatedTransfers.push(entry);
        });
        if (relatedTransfers.length > 0) {
          const accountTransfers = await transferDB.getAllFromIndex(
            "transfers",
            "accountID",
            account._internalID._value
          );

          if (accountTransfers.length > 0) {
            let transformedTransfers: Array<IBasicTransferClass>;

            transformedTransfers = relatedTransfers.map((entry) => {
              const result = accountTransfers.find((accountTransfer) => {
                return accountTransfer._internalID._value === entry;
              });

              if (result) {
                return result;
              } else {
                throw new Error("Transfer transformation failed !");
              }
            });

            if (transformedTransfers.length > 0) {
              const getCalcResult = getLatestAccountBalance(
                account.openingBalance._value,
                transformedTransfers
              );
              self.postMessage({
                calc: true,
                targetAccount: account._internalID._value,
                data: getCalcResult,
              });
            }
          }
        } else {
          //return empty calc object
          self.postMessage({
            calc: true,
            targetAccount: account._internalID._value,
            data: {
              lastMonth: {
                balance: account.openingBalance._value,
                income: 0,
                outgoing: 0,
              },
              currentMonth: {
                balance: account.openingBalance._value,
                income: 0,
                outgoing: 0,
              },
            },
          });
        }
      }
    }
  }
});

const getLatestAccountBalance = (
  openingBalance: number,
  relatedTransfers: Array<IBasicTransferClass>
): AccountCalcData => {
  const date = new Date();
  const currentMonth = date.getMonth();
  date.setDate(1);
  date.setMonth(currentMonth - 1);
  const lastMonth = date.getMonth();
  const relatedYear = date.getFullYear();

  const beforeTransfers: Array<IBasicTransferClass> = [];
  const lastMonthTransfers: Array<IBasicTransferClass> = [];
  const currentMonthTransfers: Array<IBasicTransferClass> = [];

  relatedTransfers.forEach((transferEntry) => {
    if (
      transferEntry.valutaDate._dateMetaInformation.month === lastMonth &&
      transferEntry.valutaDate._dateMetaInformation.year === relatedYear
    ) {
      lastMonthTransfers.push(transferEntry);
    } else if (
      transferEntry.valutaDate._dateMetaInformation.month === currentMonth &&
      transferEntry.valutaDate._dateMetaInformation.year === relatedYear
    ) {
      currentMonthTransfers.push(transferEntry);
    } else {
      beforeTransfers.push(transferEntry);
    }
  });

  const resultObject = {
    lastMonth: {
      balance: 0,
      income: 0,
      outgoing: 0,
    },
    currentMonth: {
      balance: 0,
      income: 0,
      outgoing: 0,
    },
  };

  const lastMentionedBalance = beforeTransfers.reduce((acc, curr) => {
    return acc + curr.value._value;
  }, openingBalance);

  const lastMonthValues = lastMonthTransfers.reduce<{
    income: number;
    outgoing: number;
  }>(
    (acc, curr) => {
      if (curr.value._value >= 0) {
        acc.income = acc.income + curr.value._value;
        return acc;
      } else if (curr.value._value < 0) {
        acc.outgoing = acc.outgoing + curr.value._value;
        return acc;
      } else {
        return acc;
      }
    },
    { income: 0, outgoing: 0 }
  );

  resultObject.lastMonth.income = lastMonthValues.income;
  resultObject.lastMonth.outgoing = lastMonthValues.outgoing;
  resultObject.lastMonth.balance =
    lastMentionedBalance + lastMonthValues.income + lastMonthValues.outgoing;

  const currentMonthValues = currentMonthTransfers.reduce<{
    income: number;
    outgoing: number;
  }>(
    (acc, curr) => {
      if (curr.value._value >= 0) {
        acc.income = acc.income + curr.value._value;
        return acc;
      } else if (curr.value._value < 0) {
        acc.outgoing = acc.outgoing + curr.value._value;
        return acc;
      } else {
        return acc;
      }
    },
    { income: 0, outgoing: 0 }
  );

  resultObject.currentMonth.income = currentMonthValues.income;
  resultObject.currentMonth.outgoing = currentMonthValues.outgoing;
  resultObject.currentMonth.balance =
    resultObject.lastMonth.balance +
    currentMonthValues.income +
    currentMonthValues.outgoing;

  return resultObject;
};
