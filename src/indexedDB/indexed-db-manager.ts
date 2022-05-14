import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from "idb";
import {
  IDBAccounts,
  IDBAppData,
  IDBTransfers,
  IDBUserData,
} from "./db-schemas";
import { TagsObject } from "@/store/appData/app-data-types";

enum DataBases {
  USER_DATA = "user-data",
  APP_DATA = "app-data",
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
  appDB: {
    dbname: DataBases.APP_DATA,
    currentVersion: 1,
  },
};

export class IndexedDBStoreManager {
  private static _storeManager: null | IndexedDBStoreManager = null;

  private static _app_data: null | IDBPDatabase<IDBAppData> = null;
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

  public async initAppData() {
    console.log("Init starts");
    const appDatabase = DBProvider.appDB;
    IndexedDBStoreManager._app_data = await openDB<IDBAppData>(
      appDatabase.dbname,
      appDatabase.currentVersion,
      {
        upgrade(db) {
          if (!db.objectStoreNames.contains("tags")) {
            const store = db.createObjectStore("tags", {
              keyPath: "id",
            });
            store.createIndex("groupname", "groupname", { unique: true });
            store.createIndex("tags", "tags", {
              unique: true,
              multiEntry: true,
            });
          }
        },
      }
    );
    IndexedDBStoreManager._app_data.add("tags", {
      id: `default_group_v${appDatabase.currentVersion}`,
      groupname: "default",
      tags: [],
    });
  }
  /*
   *Generic functions
   */
  //AppData-DB
  public async addTagAndGroup(payload: {
    groupname: string;
    tag?: string | Array<string>;
  }) {
    const appDB = IndexedDBStoreManager._app_data;

    if (appDB) {
      try {
        const originalResult = await appDB.getFromIndex(
          "tags",
          "groupname",
          payload.groupname
        );
        if (!originalResult) {
          const newTagsGroup: TagsObject = {
            id: `${payload.groupname}_group_v${DBProvider.appDB.currentVersion}`,
            groupname: payload.groupname,
            tags: [],
          };
          if (
            payload.tag &&
            typeof payload.tag === "string" &&
            payload.tag !== ""
          ) {
            newTagsGroup.tags.push(payload.tag);
          } else if (
            payload.tag &&
            Array.isArray(payload.tag) &&
            payload.tag.length > 0
          ) {
            newTagsGroup.tags = payload.tag;
          }
          appDB.add("tags", newTagsGroup);
        } else {
          console.log("Result is given");
          throw new Error(`Group ${payload.groupname} already exists`);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      throw new Error("Database error");
    }
  }
  public async addTagToGroup(payload: { groupname: string; tag: string }) {
    const appDB = IndexedDBStoreManager._app_data;

    if (appDB) {
      try {
        const originalResult = await appDB.getFromIndex(
          "tags",
          "groupname",
          payload.groupname
        );
        if (originalResult) {
          if (!originalResult.tags.includes(payload.tag)) {
            const newTags = [...originalResult.tags];
            newTags.push(payload.tag);
            originalResult.tags = newTags;
            appDB.put("tags", originalResult);
          } else {
            throw new Error("Tag already exists");
          }
        } else {
          throw new Error(`Collection in tags: ${payload.groupname} not found`);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      throw new Error("Database error");
    }
  }
  //TODO
  public async deleteTagFromGroup() {}
  public async moveTagToAnotherGroup() {}
  public async deleteGroup() {}
  public async updateGroupName() {}
  //UserData-DB
  //Accounts-DB
  //Transfers-DB
  /*
   *Generic functions End
   */
}

export const DBManager = IndexedDBStoreManager.StoreManager;
