import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from "idb";
import { DistKeyObject, TagsObject } from "@/store/appData/app-data-types";

export interface IDBCustomData extends DBSchema {
  tags: {
    value: TagsObject;
    key: string;
    indexes: { groupname: string; tags: Array<string> };
  };
  distKeys: {
    value: DistKeyObject;
    key: string;
    indexes: { distKeyName: string };
  };
}

enum DataBases {
  CUSTOM_DATA = "custom-data",
}

const DBProvider = {
  customDB: {
    dbname: DataBases.CUSTOM_DATA,
    currentVersion: 1,
  },
};

export class IndexedDBCustomDataManager {
  private static _storeManager: null | IndexedDBCustomDataManager = null;

  private _custom_data: null | IDBPDatabase<IDBCustomData> = null;

  private constructor() {
    this._custom_data;
  }

  public static get StoreManager() {
    if (!IndexedDBCustomDataManager._storeManager) {
      IndexedDBCustomDataManager._storeManager =
        new IndexedDBCustomDataManager();
    }
    return IndexedDBCustomDataManager._storeManager;
  }

  public async initDB() {
    const appDatabase = DBProvider.customDB;
    this._custom_data = await openDB<IDBCustomData>(
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
          if (!db.objectStoreNames.contains("distKeys")) {
            const store = db.createObjectStore("distKeys", {
              keyPath: "distKeyName",
            });
            store.createIndex("distKeyName", "distKeyName", {
              unique: true,
            });
          }
        },
      }
    );

    this._custom_data.add("tags", {
      id: `default_group_v${appDatabase.currentVersion}`,
      groupname: "default",
      tags: [],
    });
  }
  /*
   *Generic functions
   */
  public async addTagAndGroup(payload: {
    groupname: string;
    tag?: string | Array<string>;
  }) {
    if (!this._custom_data) {
      try {
        await this.initDB();
      } catch (err) {
        console.log("ERR", err);
      }
    }

    if (this._custom_data) {
      const customDataDB = this._custom_data;
      try {
        const originalResult = await customDataDB.getFromIndex(
          "tags",
          "groupname",
          payload.groupname
        );
        if (!originalResult) {
          const newTagsGroup: TagsObject = {
            id: `${payload.groupname}_group_v${DBProvider.customDB.currentVersion}`,
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
          customDataDB.add("tags", newTagsGroup);
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
    if (!this._custom_data) {
      try {
        await this.initDB();
      } catch (err) {
        console.log("ERR", err);
      }
    }

    if (this._custom_data) {
      const customDataDB = this._custom_data;
      try {
        const originalResult = await customDataDB.getFromIndex(
          "tags",
          "groupname",
          payload.groupname
        );
        if (originalResult) {
          if (!originalResult.tags.includes(payload.tag)) {
            const newTags = [...originalResult.tags];
            newTags.push(payload.tag);
            originalResult.tags = newTags;
            customDataDB.put("tags", originalResult);
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
  public async deleteTagFromGroup(payload: { groupname: string; tag: string }) {
    if (!this._custom_data) {
      try {
        await this.initDB();
      } catch (err) {
        console.log("ERR", err);
      }
    }

    if (this._custom_data) {
      const customDataDB = this._custom_data;
      try {
        const originalResult = await customDataDB.getFromIndex(
          "tags",
          "groupname",
          payload.groupname
        );
        if (originalResult) {
          if (originalResult.tags.includes(payload.tag)) {
            const newTags = originalResult.tags.filter((entry) => {
              return entry !== payload.tag;
            });
            originalResult.tags = newTags;
            customDataDB.put("tags", originalResult);
          } else {
            throw new Error("Tag doesn't exist");
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
  public async moveTagToAnotherGroup(payload: {
    originGroupname: string;
    targetGroupname: string;
    tag: string;
  }) {
    if (!this._custom_data) {
      try {
        await this.initDB();
      } catch (err) {
        console.log("ERR", err);
      }
    }

    if (this._custom_data) {
      const customDataDB = this._custom_data;
      try {
        const originResult = await customDataDB.getFromIndex(
          "tags",
          "groupname",
          payload.originGroupname
        );
        if (!originResult) {
          throw new Error("Group not found");
        }
        if (!originResult?.tags.includes(payload.tag)) {
          throw new Error("Tag not found");
        } else {
          const newTags = originResult.tags.filter((entry) => {
            return entry !== payload.tag;
          });
          originResult.tags = newTags;
          customDataDB.put("tags", originResult);
        }

        const targetResult = await customDataDB.getFromIndex(
          "tags",
          "groupname",
          payload.targetGroupname
        );
        if (!targetResult) {
          throw new Error("Group not found");
        }
        if (targetResult?.tags.includes(payload.tag)) {
          throw new Error("Tag already exist in Group");
        } else {
          const newTags = [...targetResult.tags];
          newTags.push(payload.tag);
          targetResult.tags = newTags;
          customDataDB.put("tags", targetResult);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      throw new Error("Database error");
    }
  }
  public async deleteGroup(groupname: string) {
    if (!this._custom_data) {
      try {
        await this.initDB();
      } catch (err) {
        console.log("ERR", err);
      }
    }

    if (this._custom_data) {
      const customDataDB = this._custom_data;
      try {
        customDataDB.delete("tags", groupname);
      } catch (err) {
        console.log(err);
      }
    } else {
      throw new Error("Database error");
    }
  }
  public async updateGroupName(payload: {
    oldGroupName: string;
    newGroupName: string;
  }) {
    if (!this._custom_data) {
      try {
        await this.initDB();
      } catch (err) {
        console.log("ERR", err);
      }
    }

    if (this._custom_data) {
      const customDataDB = this._custom_data;
      try {
        const targetGroup = await customDataDB.getFromIndex(
          "tags",
          "groupname",
          payload.oldGroupName
        );

        if (targetGroup) {
          targetGroup.groupname = payload.newGroupName;
          customDataDB.put("tags", targetGroup);
        } else {
          throw new Error("Group not found");
        }
      } catch (err) {}
    } else {
      throw new Error("Database error");
    }
  }
  /*
   *Generic functions End
   */
}

const IndexedDBCustomDataStoreManager = IndexedDBCustomDataManager.StoreManager;

export default IndexedDBCustomDataStoreManager;
