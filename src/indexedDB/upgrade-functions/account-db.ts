import { LogMe } from "@/logging/logger-function";
import { IDBPDatabase } from "idb";
import { IDBAccounts } from "../account-database";

export type accountDBSchema = IDBPDatabase<IDBAccounts>;

export const upgradeAccountDB = (db: accountDBSchema) => {
  LogMe.indexedDB("Upgrade account DB");
  if (!db.objectStoreNames.contains("accounts")) {
    const store = db.createObjectStore("accounts", {
      keyPath: "_internalID._value",
    });
    store.createIndex("isSelected", "isSelected._valueMeta");
  }
  if (!db.objectStoreNames.contains("Cache")) {
    const store = db.createObjectStore("Cache", {
      keyPath: "accountID",
    });
  }
};
