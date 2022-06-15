import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from "idb";
import { IDBAccounts } from "../account-database";

export type accountDBSchema = IDBPDatabase<IDBAccounts>;

export const upgradeAccountDB = (db: accountDBSchema) => {
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
