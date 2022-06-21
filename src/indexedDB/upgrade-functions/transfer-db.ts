import { LogMe } from "@/logging/logger-function";
import { IDBPDatabase } from "idb";
import { IDBTransfers } from "../transfer-database";

export type transferDBSchema = IDBPDatabase<IDBTransfers>;

export const upgradeTransferDB = (db: transferDBSchema) => {
  LogMe.indexedDB("Upgrade transfer DB");
  if (!db.objectStoreNames.contains("transfers")) {
    const store = db.createObjectStore("transfers", {
      keyPath: "_internalID._value",
    });
    store.createIndex("isSelected", "isSelected._valueMeta");
    store.createIndex("accountID", "_accountID._value");
    store.createIndex(
      "valuta-yearMonth",
      "valutaDate._dateMetaInformation.yearmonth"
    );
  }
  if (!db.objectStoreNames.contains("pages")) {
    const store = db.createObjectStore("pages", {
      keyPath: "yearMonth",
    });
    store.createIndex("year", "year");
    store.createIndex("month", "month");
  }
  if (!db.objectStoreNames.contains("Cache")) {
    const store = db.createObjectStore("Cache", {
      keyPath: "id",
    });
  }
};
