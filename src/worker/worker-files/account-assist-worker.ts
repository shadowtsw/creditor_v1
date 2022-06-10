import { PageObject } from "@/indexedDB/transfer-interfaces/transfer-meta-interfaces";
import {
  upgradeAccountDB,
  accountDBSchema,
} from "@/indexedDB/upgrade-functions/account-db";
import {
  transferDBSchema,
  upgradeTransferDB,
} from "@/indexedDB/upgrade-functions/transfer-db";
import { Pagination } from "@/interfaces/pages/page-types";
import { IBasicTransferClass } from "@/interfaces/transfers/transfers";
import { ApplicationEnvironmentStore } from "@/store/application/application-store";
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from "idb";
import {
  DBProvider as AccountProvider,
  IDBAccounts,
} from "../../indexedDB/account-database";
import {
  DBProvider as TransferProvider,
  IDBTransfers,
} from "../../indexedDB/transfer-database";
import {
  InitMessageTargets,
  AAW_MessageTypes,
  ResponseBalanceMessage,
  IncomingMessages,
  OutgoingMessages,
  AAWResPagination,
  AAWResBalance,
} from "../message-interfaces/account-assist-interface";
import { getLatestAccountBalance } from "../worker-functions/account-assist-worker/account-balance";

/**
 * DB related
 */
let accountDB: accountDBSchema;
let transferDB: transferDBSchema;
const openAccountDB = async (): Promise<boolean> => {
  let relatedDB = AccountProvider.accountsDB.dbname;
  if (ApplicationEnvironmentStore.Demo) {
    relatedDB = AccountProvider.accountsDB.dbDemoName;
  }
  const db = await openDB<IDBAccounts>(
    relatedDB,
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
  let relatedDB = TransferProvider.transferDB.dbname;
  if (ApplicationEnvironmentStore.Demo) {
    relatedDB = TransferProvider.transferDB.dbDemoName;
  }
  const db = await openDB<IDBTransfers>(
    relatedDB,
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

/**
 * PAGINATION for Frontend
 */
const pages: Pagination = {};
const createPagination = async (): Promise<boolean> => {
  console.time("START PAGINATION");
  try {
    let cursor = await transferDB.transaction("pages").store.openCursor();

    while (cursor) {
      if (!pages.hasOwnProperty(cursor.value.year)) {
        pages[cursor.value.year] = {};
      }
      if (!pages[cursor.value.year].hasOwnProperty(cursor.value.month)) {
        pages[cursor.value.year][cursor.value.month] = [];
      }
      if (pages[cursor.value.year][cursor.value.month].length === 0) {
        pages[cursor.value.year][cursor.value.month] = cursor.value.transfers;
      } else {
        console.log("Duplicate ?");
        console.log(cursor.key, cursor.value);
      }
      cursor = await cursor.continue();
    }
    console.timeEnd("START PAGINATION");
    console.log("Pages", pages);
    return Promise.resolve(true);
  } catch (err) {
    throw new Error(`Failed to create pagination: ${err}`);
  }
};
const updatePagination = async (
  payload: IBasicTransferClass
): Promise<boolean> => {
  if (!transferDB) {
    try {
      await openTransferDB();
    } catch (err) {
      throw new Error(`Failed to init DB:${err}`);
    }
  }

  if (transferDB) {
    const year = payload.valutaDate._dateMetaInformation.year;
    const month = payload.valutaDate._dateMetaInformation.month;
    const yearMonth = payload.valutaDate._dateMetaInformation.yearmonth;

    const newPageObject = {
      accountID: payload._accountID._value,
      transferID: payload._internalID._value,
      year: year,
      month: month,
      yearMonth: yearMonth,
    };

    try {
      const target = await transferDB.get("pages", yearMonth);
      if (target) {
        const findEntry = target.transfers.find((entry) => {
          return entry.transferID === payload._internalID._value;
        });
        if (!findEntry) {
          target.transfers.push(newPageObject);
          await transferDB.put("pages", target);
          pages[year][month].push({
            accountID: payload._accountID._value,
            transferID: payload._internalID._value,
          });
          console.log("Updated pages", pages);
          return Promise.resolve(true);
        } else {
          throw new Error("PageObject already exist");
        }
      } else {
        await transferDB.add("pages", {
          yearMonth: yearMonth,
          transfers: [newPageObject],
          year: year,
          month: month,
        });
        pages[year][month].push({
          accountID: payload._accountID._value,
          transferID: payload._internalID._value,
        });
        console.log("Updated pages", pages);
        return Promise.resolve(true);
      }
    } catch (err) {
      throw new Error("Failed to add page");
    }
  } else {
    throw new Error("Database not found");
  }
};
const deleteFromPagination = async (
  payload: IBasicTransferClass
): Promise<boolean> => {
  if (!transferDB) {
    try {
      await openTransferDB();
    } catch (err) {
      throw new Error(`Failed to init DB:${err}`);
    }
  }

  if (transferDB) {
    const year = payload.valutaDate._dateMetaInformation.year;
    const month = payload.valutaDate._dateMetaInformation.month;
    const yearMonth = payload.valutaDate._dateMetaInformation.yearmonth;

    try {
      const target = await transferDB.get("pages", yearMonth);
      if (target) {
        const findEntry = target.transfers.findIndex((entry) => {
          return entry.transferID === payload._internalID._value;
        });
        if (findEntry) {
          target.transfers.splice(findEntry, 1);
          await transferDB.put("pages", target);
          pages[year][month] = pages[year][month].filter((entry) => {
            return entry.transferID === payload._internalID._value;
          });
          return Promise.resolve(true);
        } else {
          return Promise.resolve(true);
        }
      } else {
        throw new Error("Page does not exist !");
      }
    } catch (err) {
      throw new Error("Failed to add page");
    }
  } else {
    throw new Error("Database not found");
  }
};

/**
 * FUNCTIONS
 */

// const getLatestAccountBalance = (
//   openingBalance: number,
//   relatedTransfers: Array<IBasicTransferClass>
// ): AccountBalanceObject => {
//   const date = new Date();
//   const currentMonth = date.getMonth();
//   date.setDate(1);
//   date.setMonth(currentMonth - 1);
//   const lastMonth = date.getMonth();
//   const relatedYear = date.getFullYear();

//   const beforeTransfers: Array<IBasicTransferClass> = [];
//   const lastMonthTransfers: Array<IBasicTransferClass> = [];
//   const currentMonthTransfers: Array<IBasicTransferClass> = [];

//   relatedTransfers.forEach((transferEntry) => {
//     if (
//       transferEntry.valutaDate._dateMetaInformation.month === lastMonth &&
//       transferEntry.valutaDate._dateMetaInformation.year === relatedYear
//     ) {
//       lastMonthTransfers.push(transferEntry);
//     } else if (
//       transferEntry.valutaDate._dateMetaInformation.month === currentMonth &&
//       transferEntry.valutaDate._dateMetaInformation.year === relatedYear
//     ) {
//       currentMonthTransfers.push(transferEntry);
//     } else {
//       beforeTransfers.push(transferEntry);
//     }
//   });

//   const resultObject = {
//     lastMonth: {
//       balance: 0,
//       income: 0,
//       outgoing: 0,
//     },
//     currentMonth: {
//       balance: 0,
//       income: 0,
//       outgoing: 0,
//     },
//   };

//   const lastMentionedBalance = beforeTransfers.reduce((acc, curr) => {
//     return acc + curr.value._value;
//   }, openingBalance);

//   const lastMonthValues = lastMonthTransfers.reduce<{
//     income: number;
//     outgoing: number;
//   }>(
//     (acc, curr) => {
//       if (curr.value._value >= 0) {
//         acc.income = acc.income + curr.value._value;
//         return acc;
//       } else if (curr.value._value < 0) {
//         acc.outgoing = acc.outgoing + curr.value._value;
//         return acc;
//       } else {
//         return acc;
//       }
//     },
//     { income: 0, outgoing: 0 }
//   );

//   resultObject.lastMonth.income = lastMonthValues.income;
//   resultObject.lastMonth.outgoing = lastMonthValues.outgoing;
//   resultObject.lastMonth.balance =
//     lastMentionedBalance + lastMonthValues.income + lastMonthValues.outgoing;

//   const currentMonthValues = currentMonthTransfers.reduce<{
//     income: number;
//     outgoing: number;
//   }>(
//     (acc, curr) => {
//       if (curr.value._value >= 0) {
//         acc.income = acc.income + curr.value._value;
//         return acc;
//       } else if (curr.value._value < 0) {
//         acc.outgoing = acc.outgoing + curr.value._value;
//         return acc;
//       } else {
//         return acc;
//       }
//     },
//     { income: 0, outgoing: 0 }
//   );

//   resultObject.currentMonth.income = currentMonthValues.income;
//   resultObject.currentMonth.outgoing = currentMonthValues.outgoing;
//   resultObject.currentMonth.balance =
//     resultObject.lastMonth.balance +
//     currentMonthValues.income +
//     currentMonthValues.outgoing;

//   return resultObject;
// };

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

  if (event.data && event.data.type) {
    const message = event.data as IncomingMessages;

    if (message.type === AAW_MessageTypes.INIT) {
      switch (message.messageData.target) {
        case InitMessageTargets.ACCOUNT_DB:
          await openAccountDB();
          break;
        case InitMessageTargets.TRANSFER_DB:
          await openTransferDB();
          await createPagination();
          postPaginationMessage();
          break;
        default:
          throw new Error("Message target not found");
          break;
      }
    }

    if (message.type !== AAW_MessageTypes.INIT) {
      switch (message.type) {
        case AAW_MessageTypes.REQUEST_CALC:
          break;
        case AAW_MessageTypes.REQUEST_PAGINATION:
          if (Object.keys(pages).length === 0) {
            await createPagination();
          }
          postPaginationMessage();
          break;
        case AAW_MessageTypes.UPDATE_PAGINATION:
          await updatePagination(message.messageData);
          postPaginationMessage();
          break;
        case AAW_MessageTypes.DELETE_FROM_PAGINATION:
          await deleteFromPagination(message.messageData);
          postPaginationMessage();
          break;
        default:
          throw new Error("Unknown message type");
          break;
      }
      // let relatedTransfers = [] as Array<
      //   string | IBasicTransferClass | undefined
      // >;
      // let account = null;

      // account = await accountDB.get("accounts", message.messageData.accountID);

      // if (account) {
      //   account.transfers._value.forEach((entry) => {
      //     relatedTransfers.push(entry);
      //   });
      //   if (relatedTransfers.length > 0) {
      //     const accountTransfers = await transferDB.getAllFromIndex(
      //       "transfers",
      //       "accountID",
      //       account._internalID._value
      //     );

      //     if (accountTransfers.length > 0) {
      //       let transformedTransfers: Array<IBasicTransferClass>;

      //       transformedTransfers = relatedTransfers.map((entry) => {
      //         const result = accountTransfers.find((accountTransfer) => {
      //           return accountTransfer._internalID._value === entry;
      //         });

      //         if (result) {
      //           return result;
      //         } else {
      //           throw new Error("Transfer transformation failed !");
      //         }
      //       });

      //       if (transformedTransfers.length > 0) {
      //         const getCalcResult = getLatestAccountBalance(
      //           account.openingBalance._value,
      //           transformedTransfers
      //         );

      //         const messageResponse: OutgoingMessages = {
      //           type: AAW_MessageTypes.RESPONSE_CALC,
      //           messageData: {
      //             accountID: message.messageData.accountID,
      //             data: getCalcResult,
      //           },
      //         };

      //         self.postMessage(messageResponse);
      //       }
      //     }
      //   } else {
      //     //return empty calc object
      //     const messageResponse: ResponseBalanceMessage = {
      //       type: AAW_MessageTypes.RESPONSE_CALC,
      //       messageData: {
      //         accountID: message.messageData.accountID,
      //         data: {
      //           lastMonth: {
      //             balance: account.openingBalance._value,
      //             income: 0,
      //             outgoing: 0,
      //           },
      //           currentMonth: {
      //             balance: account.openingBalance._value,
      //             income: 0,
      //             outgoing: 0,
      //           },
      //         },
      //       },
      //     };
      //     self.postMessage(messageResponse);
      //   }
      // }
    }
  }
});

const postBalanceMessage = (payload: AAWResBalance) => {
  self.postMessage(payload);
};
const postPaginationMessage = () => {
  self.postMessage({
    type: AAW_MessageTypes.RESPONSE_PAGINATION,
    messageData: pages,
  });
};
