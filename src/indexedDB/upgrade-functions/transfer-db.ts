import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from "idb";
import { IDBTransfers } from "../transfer-database";

export type transferDBSchema = IDBPDatabase<IDBTransfers>;

export const upgradeTransferDB = (db: transferDBSchema) => {
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
};
