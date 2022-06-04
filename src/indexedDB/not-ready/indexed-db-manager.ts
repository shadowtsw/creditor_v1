import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from "idb";
import {
  IDBAccounts,
  IDBAppData,
  IDBTransfers,
  IDBUserData,
} from "./db-schemas";
import { TagsObject } from "@/store/sub-data/sub-data-store-types";

enum DataBases {
  USER_DATA = "user-data",
  ACCOUNTS = "accounts",
  TRANSFERS = "transfers",
  EXAMPLE_STORE = "example-store",
}

const DBProvider = {
  userDB: {
    dbname: DataBases.USER_DATA,
    currentVersion: 1,
  },
  accountDB: {
    dbname: DataBases.ACCOUNTS,
    currentVersion: 1,
  },
};

export class IndexedDBStoreManager {
  private static _storeManager: null | IndexedDBStoreManager = null;

  private static _app_state_data: null | IDBPDatabase<IDBAppData> = null;
  private static _user_data: null | IDBPDatabase<IDBUserData> = null;
  private static _accounts_data: null | IDBPDatabase<IDBAccounts> = null;
  private static _transfers_data: null | IDBPDatabase<IDBTransfers> = null;

  private constructor() {}

  public static get StoreManager() {
    if (!IndexedDBStoreManager._storeManager) {
      IndexedDBStoreManager._storeManager = new IndexedDBStoreManager();
    }
    return IndexedDBStoreManager._storeManager;
  }
  /*
   *Generic functions
   */
  //TODO
  //UserData-DB
  //Accounts-DB
  //Transfers-DB
  /*
   *Generic functions End
   */
}

export const DBManager = IndexedDBStoreManager.StoreManager;
