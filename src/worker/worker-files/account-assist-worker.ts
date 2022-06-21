import {
  upgradeAccountDB,
  accountDBSchema,
} from "@/indexedDB/upgrade-functions/account-db";
import {
  transferDBSchema,
  upgradeTransferDB,
} from "@/indexedDB/upgrade-functions/transfer-db";
import { Pagination, PageObject } from "@/interfaces/transfers/page-types";
import { IBasicTransferClass } from "@/interfaces/transfers/transfers";
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
import {
  BalanceByYearMonth,
  MonthBalanceObject,
  SaldoByYearMonth,
  SaldoObject,
  AccountBalanceObject,
} from "@/interfaces/accounts/saldo-balance-types";
// import { getLatestAccountBalance } from "../worker-functions/account-assist-worker/account-balance";
import {
  getYearMonth,
  getDateFromYearMonth,
  calcNewYearMonth,
} from "@/utils/config-generator";
import { LogMe } from "@/logging/logger-function";

LogMe.worker("Account-Assist-Worker created");

/**
 * DB related
 */
let accountDB: accountDBSchema;
let transferDB: transferDBSchema;
let demoDataBases: boolean = false;

const openAccountDB = async (): Promise<boolean> => {
  let relatedDB = AccountProvider.accountsDB.dbname;
  if (demoDataBases) {
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
  if (demoDataBases) {
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
//TODO: needs multiple update
let pages: Pagination = {};
const createPagination = async (
  recreate: boolean = false
): Promise<boolean> => {
  LogMe.info("Create pagination");
  if (!transferDB) {
    try {
      await openTransferDB();
    } catch (err) {
      throw new Error(`Failed to init DB:${err}`);
    }
  }

  try {
    const existingPagination = await transferDB.get("Cache", "Pagination");
    if (
      existingPagination &&
      Object.keys(existingPagination).length > 0 &&
      !recreate
    ) {
      pages = existingPagination.data;
      return Promise.resolve(true);
    } else {
      if (recreate) {
        await transferDB.delete("Cache", "Pagination");
        pages = {};
      }
      // console.log("Pagination not found, create new one");
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
          // console.log("Duplicate ?");
        }
        // console.log(cursor.key, cursor.value);
        cursor = await cursor.continue();
      }
      if (Object.keys(pages).length > 0) {
        await transferDB.add("Cache", {
          id: "Pagination",
          lastModified: new Date().getTime(),
          data: pages,
        });
      } else {
        console.warn("Pagination empty");
      }
      return Promise.resolve(true);
    }
  } catch (err) {
    throw new Error(`Failed to create pagination: ${err}`);
  }
};
const updatePagination = async (
  payload: IBasicTransferClass
): Promise<boolean> => {
  LogMe.info("Update pagination");
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
        const findEntry = target.transfers.find((entry: PageObject) => {
          return entry.transferID === payload._internalID._value;
        });
        if (!findEntry) {
          target.transfers.push(newPageObject);
          await transferDB.put("pages", target);
          if (!pages.hasOwnProperty(year)) {
            pages[year] = {};
          }
          if (!pages[year].hasOwnProperty(month)) {
            pages[year][month] = [];
          }
          pages[year][month].push({
            accountID: payload._accountID._value,
            transferID: payload._internalID._value,
            year: payload.valutaDate._dateMetaInformation.year,
            month: payload.valutaDate._dateMetaInformation.month,
            yearMonth: payload.valutaDate._dateMetaInformation.yearmonth,
          });
          await updatePaginationCache(pages);
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
        if (!pages.hasOwnProperty(year)) {
          pages[year] = {};
        }
        if (!pages[year].hasOwnProperty(month)) {
          pages[year][month] = [];
        }
        pages[year][month].push({
          accountID: payload._accountID._value,
          transferID: payload._internalID._value,
          year: payload.valutaDate._dateMetaInformation.year,
          month: payload.valutaDate._dateMetaInformation.month,
          yearMonth: payload.valutaDate._dateMetaInformation.yearmonth,
        });
        await updatePaginationCache(pages);
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
  LogMe.info("Delete from pagination");
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
          await updatePaginationCache(pages);
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
const updatePaginationCache = async (
  pagesObject: Pagination
): Promise<boolean> => {
  LogMe.info("Pagination cache updates");
  const updatedPagination = await transferDB.get("Cache", "Pagination");
  if (updatedPagination) {
    updatedPagination.data = pagesObject;
    updatedPagination.lastModified = new Date().getTime();
    await transferDB.put("Cache", updatedPagination);
    return Promise.resolve(true);
  } else {
    throw new Error("Error during update, Pagination entry not found");
  }
};

/**
 * ACCOUNT Calculation
 */
//State
const monthlyAccountBalance: BalanceByYearMonth = {};
//State
const saldoByYearMonth: SaldoByYearMonth = {};
//State
const currentBalanceCache: {
  [index: string]: AccountBalanceObject & { lastModified: number };
} = {};
//Functions
//TODO: needs multiple update
//Creator
const calculateInitialMonthlyBalance = async (
  accountID: string,
  recreate: boolean = false
): Promise<boolean> => {
  LogMe.info("Monthly balance calculation starts");
  const balanceSummary: MonthBalanceObject = {};

  try {
    //Try db first
    const monthlyBalanceCache = await accountDB.get("Cache", accountID);

    if (
      monthlyBalanceCache &&
      Object.keys(monthlyBalanceCache.balanceData).length > 0 &&
      !recreate
    ) {
      if (!monthlyAccountBalance.hasOwnProperty(accountID)) {
        monthlyAccountBalance[accountID] = {};
      }
      monthlyAccountBalance[accountID] = monthlyBalanceCache.balanceData;
      await calculateInitialSaldo(accountID, recreate);
      return Promise.resolve(true);
    }
    //Go on with initial calculation
    if (recreate) {
      await accountDB.delete("Cache", accountID);
      monthlyAccountBalance[accountID] = {};
    }
    const targetAccount = await accountDB.get("accounts", accountID);
    if (targetAccount) {
      let cursor = await transferDB
        .transaction("transfers")
        .store.index("accountID")
        .openCursor(accountID);

      while (cursor) {
        const yearMonth =
          cursor.value.valutaDate._dateMetaInformation.yearmonth;
        const value = cursor.value.value._value;

        if (!balanceSummary.hasOwnProperty(yearMonth)) {
          balanceSummary[yearMonth] = { income: 0, outgoing: 0, sum: 0 };
        }
        if (value > 0) {
          balanceSummary[yearMonth].income += value;
        } else {
          balanceSummary[yearMonth].outgoing += value;
        }
        balanceSummary[yearMonth].sum += value;
        cursor = await cursor.continue();
      }

      if (!monthlyAccountBalance.hasOwnProperty(accountID)) {
        monthlyAccountBalance[accountID] = {};
      }

      monthlyAccountBalance[accountID] = balanceSummary;
      if (Object.keys(monthlyAccountBalance[accountID]).length > 0) {
        await accountDB.add("Cache", {
          accountID: accountID,
          lastModified: new Date().getTime(),
          balanceData: monthlyAccountBalance[accountID],
          saldoData: {},
        });
      }
      await calculateInitialSaldo(accountID, recreate);
      return Promise.resolve(true);
    } else {
      throw new Error("Account not found");
    }
  } catch (err) {
    throw new Error(`Failed to create balance summary ${accountID}: ${err}`);
  }
};
const calculateInitialSaldo = async (
  accountID: string,
  recreate: boolean = false
) => {
  LogMe.info("Initial saldo calculation starts");
  const saldoSummary: SaldoObject = {};
  let hasOpeningMonth = false;
  try {
    //Try DB first
    const saldoCache = await accountDB.get("Cache", accountID);

    if (
      saldoCache &&
      Object.keys(saldoCache.balanceData).length > 0 &&
      Object.keys(saldoCache.saldoData).length > 0 &&
      !recreate
    ) {
      if (!saldoByYearMonth.hasOwnProperty(accountID)) {
        saldoByYearMonth[accountID] = {};
      }
      saldoByYearMonth[accountID] = saldoCache.saldoData;
      createCurrentBalance(accountID);
      return Promise.resolve(true);
    }
    //Go on with initial calculation
    if (recreate) {
      const exist = await accountDB.get("Cache", accountID);
      if (exist) {
        await accountDB.delete("Cache", accountID);
      }
      saldoByYearMonth[accountID] = {};
    }
    const targetAccount = await accountDB.get("accounts", accountID);
    let previousEntry = {} as { start: number | boolean; end: number };
    if (targetAccount) {
      const openingBalance = targetAccount.openingBalance._value;
      const openingBalanceDate =
        targetAccount.openingBalanceDate._dateMetaInformation.yearmonth;
      const monthBalanceObject = monthlyAccountBalance[accountID];
      for (const entry in monthBalanceObject) {
        let convertedEntry = Number(entry);
        if (!saldoSummary.hasOwnProperty(convertedEntry)) {
          saldoSummary[convertedEntry] = { start: 0, end: 0 };
        }
        if (convertedEntry === openingBalanceDate) {
          saldoSummary[convertedEntry].start = false;
          saldoSummary[convertedEntry].end =
            openingBalance + monthBalanceObject[convertedEntry].sum;
          previousEntry = saldoSummary[convertedEntry];
          hasOpeningMonth = true;
          console.log("Opening Month");
        } else {
          saldoSummary[convertedEntry].start = previousEntry.end ?? 0;
          const start = saldoSummary[convertedEntry].start as number;
          saldoSummary[convertedEntry].end =
            start + monthBalanceObject[convertedEntry].sum;
          previousEntry = saldoSummary[convertedEntry];
        }
      }
      if (!saldoByYearMonth.hasOwnProperty(accountID)) {
        saldoByYearMonth[accountID] = {};
      }

      saldoByYearMonth[accountID] = saldoSummary;
      if (!hasOpeningMonth) {
        console.warn(`Missing opening month at ${accountID}`);
      }
      if (saldoCache) {
        // approveCurrentAndLastSaldo(accountID);
        saldoCache.lastModified = new Date().getTime();
        saldoCache.saldoData = saldoByYearMonth[accountID];
        await accountDB.put("Cache", saldoCache);
      } else {
        await accountDB.add("Cache", {
          accountID: accountID,
          lastModified: new Date().getTime(),
          balanceData: monthlyAccountBalance[accountID],
          saldoData: saldoByYearMonth[accountID],
        });
      }
      createCurrentBalance(accountID);
      return Promise.resolve(true);
    } else {
      throw new Error("Account not found");
    }
  } catch (err) {
    throw new Error(`Failed to create saldo summary ${accountID}: ${err}`);
  }
};
const createCurrentBalance = (accountID: string) => {
  LogMe.info("Current balance calculation starts");
  const todayYearMonth = getYearMonth(
    new Date().getFullYear(),
    new Date().getMonth()
  );

  const lastYearMonth = calcNewYearMonth(todayYearMonth, "decrease", 1);

  const arrayFromMonthlyAccountBalance = Object.entries(
    monthlyAccountBalance[accountID]
  );

  const arrayFromMonthlySaldo = Object.entries(saldoByYearMonth[accountID]);

  const lastEntryFromMonthlyAccountBalance =
    arrayFromMonthlyAccountBalance.sort((a, b) => Number(a[0]) - Number(b[0]))[
      arrayFromMonthlyAccountBalance.length - 1
    ];

  const lastEntryNumber = Number(lastEntryFromMonthlyAccountBalance[0]);

  const entriesFromMonthlySaldo = arrayFromMonthlySaldo.sort(
    (a, b) => Number(a[0]) - Number(b[0])
  );

  let balanceMessage: AccountBalanceObject = {
    lastMonth: {
      startBalance: 0,
      endBalance: 0,
      income: 0,
      outgoing: 0,
      sum: 0,
    },
    currentMonth: {
      startBalance: 0,
      endBalance: 0,
      income: 0,
      outgoing: 0,
      sum: 0,
    },
  };

  const switchResult =
    lastYearMonth - lastEntryNumber > 0
      ? 1
      : lastYearMonth - lastEntryNumber === 0
      ? lastYearMonth - lastEntryNumber
      : -1;

  switch (switchResult) {
    case 1: //last yearMonth-entry in cache is older than last month
      // console.log("last entry in cache is older than last month");
      balanceMessage.lastMonth.startBalance =
        entriesFromMonthlySaldo[entriesFromMonthlySaldo.length - 1][1].start;
      balanceMessage.lastMonth.endBalance =
        entriesFromMonthlySaldo[entriesFromMonthlySaldo.length - 1][1].start;
      balanceMessage.currentMonth.startBalance =
        entriesFromMonthlySaldo[entriesFromMonthlySaldo.length - 1][1].start;
      balanceMessage.currentMonth.endBalance =
        entriesFromMonthlySaldo[entriesFromMonthlySaldo.length - 1][1].start;
      break;
    case 0: //last entry equals last month
      // console.log("last entry equals last month");
      balanceMessage.lastMonth.startBalance =
        saldoByYearMonth[accountID][lastYearMonth].start || 0;
      balanceMessage.lastMonth.endBalance =
        saldoByYearMonth[accountID][lastYearMonth].end;
      balanceMessage.lastMonth.income =
        monthlyAccountBalance[accountID][lastYearMonth].income;
      balanceMessage.lastMonth.outgoing =
        monthlyAccountBalance[accountID][lastYearMonth].outgoing;
      balanceMessage.lastMonth.sum =
        monthlyAccountBalance[accountID][lastYearMonth].sum;

      balanceMessage.currentMonth.startBalance =
        entriesFromMonthlySaldo[entriesFromMonthlySaldo.length - 1][1].start;
      balanceMessage.currentMonth.endBalance =
        entriesFromMonthlySaldo[entriesFromMonthlySaldo.length - 1][1].start;
      break;
    case -1: //last entry is newer than last month and should be
      // console.log("last entry is newer than last month");
      balanceMessage.lastMonth.startBalance =
        saldoByYearMonth[accountID][todayYearMonth].start || 0;
      balanceMessage.lastMonth.endBalance =
        saldoByYearMonth[accountID][todayYearMonth].end;
      balanceMessage.lastMonth.income =
        monthlyAccountBalance[accountID][todayYearMonth].income;
      balanceMessage.lastMonth.outgoing =
        monthlyAccountBalance[accountID][todayYearMonth].outgoing;
      balanceMessage.lastMonth.sum =
        monthlyAccountBalance[accountID][todayYearMonth].sum;

      balanceMessage.currentMonth.startBalance =
        saldoByYearMonth[accountID][todayYearMonth].start || 0;
      balanceMessage.currentMonth.endBalance =
        saldoByYearMonth[accountID][todayYearMonth].end;
      balanceMessage.currentMonth.income =
        monthlyAccountBalance[accountID][todayYearMonth].income;
      balanceMessage.currentMonth.outgoing =
        monthlyAccountBalance[accountID][todayYearMonth].outgoing;
      balanceMessage.currentMonth.sum =
        monthlyAccountBalance[accountID][todayYearMonth].sum;
      break;

    default:
      throw new Error("Something went wrong with balance message");
      break;
  }

  currentBalanceCache[accountID] = {
    ...balanceMessage,
    lastModified: new Date().getTime(),
  };
};
//Updater
const updateBalance = async (
  accountID: string,
  transfer: IBasicTransferClass | Array<IBasicTransferClass>
): Promise<boolean> => {
  LogMe.info("Updating balance");
  let transfers: IBasicTransferClass | Array<IBasicTransferClass> = [];
  if (!Array.isArray(transfer)) {
    transfers.push(transfer);
  } else {
    transfers = transfer;
  }
  for (const transfer of transfers) {
    const yearMonth = transfer.valutaDate._dateMetaInformation.yearmonth;
    const value = transfer.value._value;

    if (!monthlyAccountBalance.hasOwnProperty(accountID)) {
      monthlyAccountBalance[accountID] = {};
    }

    if (!monthlyAccountBalance[accountID].hasOwnProperty(yearMonth)) {
      monthlyAccountBalance[accountID][yearMonth] = {
        income: 0,
        outgoing: 0,
        sum: 0,
      };
    }
    if (value > 0) {
      monthlyAccountBalance[accountID][yearMonth].income += value;
    } else {
      monthlyAccountBalance[accountID][yearMonth].outgoing += value;
    }
    monthlyAccountBalance[accountID][yearMonth].sum += value;
  }

  try {
    const existingData = await accountDB.get("Cache", accountID);

    if (existingData) {
      existingData.lastModified = new Date().getTime();
      existingData.balanceData = monthlyAccountBalance[accountID];
      await accountDB.put("Cache", existingData);
    } else {
      await accountDB.add("Cache", {
        accountID: accountID,
        lastModified: new Date().getTime(),
        balanceData: monthlyAccountBalance[accountID],
        saldoData: saldoByYearMonth[accountID],
      });
    }
    await updateSaldo(transfers);
    return Promise.resolve(true);
  } catch (err) {
    throw new Error("Failed to update monthly balance");
  }
};
const updateSaldo = async (
  transfer: IBasicTransferClass | Array<IBasicTransferClass>
): Promise<boolean> => {
  LogMe.info("Updating saldo");
  let transfers: IBasicTransferClass | Array<IBasicTransferClass> = [];
  let mappedTransfers;

  if (!Array.isArray(transfer)) {
    transfers.push(transfer);
  } else {
    transfers = transfer;
  }

  mappedTransfers = transfers.map((entry) => {
    return {
      transferID: entry._internalID._value,
      accountID: entry._accountID._value,
      valutaYearMonth: entry.valutaDate._dateMetaInformation.yearmonth,
    };
  });

  mappedTransfers.sort((a, b) => a.valutaYearMonth - b.valutaYearMonth);

  const accountID = transfers[0]._accountID._value;

  const saldoSummary: SaldoObject = saldoByYearMonth[accountID];
  let hasOpeningMonth = false;
  const targetAccount = await accountDB.get("accounts", accountID);
  let previousEntry = {} as { start: number | boolean; end: number };
  if (targetAccount) {
    const openingBalance = targetAccount.openingBalance._value;
    const openingBalanceDate =
      targetAccount.openingBalanceDate._dateMetaInformation.yearmonth;

    const monthBalanceObject = Object.entries(
      monthlyAccountBalance[accountID]
    ).sort((a, b) => Number(a[0]) - Number(b[0])); //ensures order

    const monthBalanceCache = monthlyAccountBalance[accountID];

    for (const entry of monthBalanceObject) {
      let convertedEntry = Number(entry[0]);

      if (convertedEntry < mappedTransfers[0].valutaYearMonth) {
        previousEntry = saldoByYearMonth[accountID][convertedEntry];
        continue;
      }

      if (!saldoSummary.hasOwnProperty(convertedEntry)) {
        saldoSummary[convertedEntry] = { start: 0, end: 0 };
      }

      if (convertedEntry === openingBalanceDate) {
        saldoSummary[convertedEntry].start = false;
        saldoSummary[convertedEntry].end =
          openingBalance + monthBalanceCache[convertedEntry].sum;
        previousEntry = saldoSummary[convertedEntry];
        hasOpeningMonth = true;
        console.log("Opening Month");
      } else {
        saldoSummary[convertedEntry].start = previousEntry.end ?? 0;
        const start = saldoSummary[convertedEntry].start as number;
        saldoSummary[convertedEntry].end =
          start + monthBalanceCache[convertedEntry].sum;
        previousEntry = saldoSummary[convertedEntry];
      }
    }
    if (!saldoByYearMonth.hasOwnProperty(accountID)) {
      saldoByYearMonth[accountID] = {};
    }

    saldoByYearMonth[accountID] = saldoSummary;

    if (!hasOpeningMonth) {
      console.warn(`Missing opening month at ${accountID}`);
    }
    try {
      const existingData = await accountDB.get("Cache", accountID);
      console.log("CURRENT SALDO", saldoByYearMonth[accountID]);
      if (existingData) {
        existingData.saldoData = saldoByYearMonth[accountID];
        existingData.lastModified = new Date().getTime();
        await accountDB.put("Cache", existingData);
      } else {
        await accountDB.add("Cache", {
          accountID: accountID,
          lastModified: new Date().getTime(),
          balanceData: monthlyAccountBalance[accountID],
          saldoData: saldoByYearMonth[accountID],
        });
      }
      createCurrentBalance(accountID);
      return Promise.resolve(true);
    } catch (err) {
      throw new Error("Failed to update saldo");
    }
  } else {
    throw new Error("Account not found");
  }
};

/**
 * MESSAGE CENTER
 */
self.addEventListener("message", async (event: MessageEvent) => {
  if (event.data && event.data.type) {
    const message = event.data as IncomingMessages;

    if (message.type === AAW_MessageTypes.INIT) {
      switch (message.messageData.target) {
        case InitMessageTargets.INIT_MODE_DEMO:
          demoDataBases = true;
          return;
        case InitMessageTargets.INIT_MODE_APP:
          demoDataBases = false;
          return;
        case InitMessageTargets.INIT_DB:
          console.time("Account calculation measurement");
          await openAccountDB();
          await openTransferDB();
          await createPagination();
          const accounts1 = await accountDB.getAll("accounts");
          for (const account of accounts1) {
            await calculateInitialMonthlyBalance(account._internalID._value);
          }

          postInitReadyMessage();
          console.timeEnd("Account calculation measurement");
          return;
        case InitMessageTargets.INIT_APP:
          postPaginationMessage();
          const accounts2 = await accountDB.getAll("accounts");
          for (const account of accounts2) {
            postCurrentBalanceMessage(account._internalID._value);
          }

          return;
        default:
          throw new Error(`Message target not found -INIT-: ${message}`);
          return;
      }
    } else {
      //TODO: approve messages
      switch (message.type) {
        case AAW_MessageTypes.REQUEST_CALC:
          postCurrentBalanceMessage(message.messageData.accountID);
          return;
        case AAW_MessageTypes.REQUEST_PAGINATION:
          postPaginationMessage();
          return;
        case AAW_MessageTypes.ADD_TRANSFER:
          if (!Array.isArray(message.messageData)) {
            await updatePagination(message.messageData);
            postPaginationMessage();
            await updateBalance(
              message.messageData._accountID._value,
              message.messageData
            );
            postCurrentBalanceMessage(message.messageData._accountID._value);
          }
          //TODO multiple updates
          return;
        // case AAW_MessageTypes.DELETE_FROM_PAGINATION:
        //   await deleteFromPagination(message.messageData);
        //   postPaginationMessage();
        //   break;
        default:
          throw new Error(`Unknown message type: ${message}`);
          return;
      }
    }
  }
});
/**
 * POST MESSAGES
 */
const postInitReadyMessage = () => {
  self.postMessage({
    type: AAW_MessageTypes.RESPONSE_INIT_READY,
  });
};
const postCurrentBalanceMessage = (accountID: string) => {
  const { lastModified, ...balanceMessage } = currentBalanceCache[accountID];

  self.postMessage({
    type: AAW_MessageTypes.RESPONSE_CALC,
    messageData: {
      accountID: accountID,
      data: balanceMessage,
    },
  });
};
const postPaginationMessage = () => {
  self.postMessage({
    type: AAW_MessageTypes.RESPONSE_PAGINATION,
    messageData: pages,
  });
};
