import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from "idb";
import {
  DistKeyObject,
  TagsObject,
} from "@/interfaces/transfers/sub-data-types";
import { LogMe } from "@/logging/logger-function";

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
    LogMe.indexedDB(
      "IndexedDBCustomDataManager | custom-data-database created"
    );
    this._custom_data;
  }

  public static get StoreManager() {
    if (!IndexedDBCustomDataManager._storeManager) {
      IndexedDBCustomDataManager._storeManager =
        new IndexedDBCustomDataManager();
    }
    LogMe.indexedDB("IndexedDBCustomDataManager");
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

    const defaultTags = this._custom_data.get(
      "tags",
      `default_group_v${appDatabase.currentVersion}`
    );

    if (!defaultTags) {
      this._custom_data.add("tags", {
        id: `default_group_v${appDatabase.currentVersion}`,
        groupname: "default",
        tags: [],
      });
    }
  }
  /*
   *Generic functions
   */
  public async addTagAndGroup(payload: {
    groupname: string;
    tag?: string | Array<string>;
  }): Promise<boolean> {
    if (!this._custom_data) {
      try {
        await this.initDB();
      } catch (err) {
        console.log(err);
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
          return Promise.resolve(true);
        } else {
          throw new Error(`Group ${payload.groupname} already exists`);
        }
      } catch (err) {
        throw new Error("Failed to add group or tag");
      }
    } else {
      throw new Error("Database error");
    }
  }
  public async addTagToGroup(payload: {
    groupname: string;
    tag: string;
  }): Promise<boolean> {
    if (!this._custom_data) {
      try {
        await this.initDB();
      } catch (err) {
        console.log(err);
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
            return Promise.resolve(true);
          } else {
            throw new Error("Tag already exists");
          }
        } else {
          throw new Error(`Collection in tags: ${payload.groupname} not found`);
        }
      } catch (err) {
        throw new Error("Failed to add tag to group");
      }
    } else {
      throw new Error("Database error");
    }
  }
  public async deleteTagFromGroup(payload: {
    groupname: string;
    tag: string;
  }): Promise<boolean> {
    if (!this._custom_data) {
      try {
        await this.initDB();
      } catch (err) {
        console.log(err);
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
            return Promise.resolve(true);
          } else {
            throw new Error("Tag doesn't exist");
          }
        } else {
          throw new Error(`Collection in tags: ${payload.groupname} not found`);
        }
      } catch (err) {
        throw new Error("Failed to delete group");
      }
    } else {
      throw new Error("Database error");
    }
  }
  public async moveTagToAnotherGroup(payload: {
    originGroupname: string;
    targetGroupname: string;
    tag: string;
  }): Promise<boolean> {
    if (!this._custom_data) {
      try {
        await this.initDB();
      } catch (err) {
        console.log(err);
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
          return Promise.resolve(true);
        }
      } catch (err) {
        throw new Error("Failed to move tag");
      }
    } else {
      throw new Error("Database error");
    }
  }
  public async deleteGroup(groupname: string): Promise<boolean> {
    if (!this._custom_data) {
      try {
        await this.initDB();
      } catch (err) {
        console.log(err);
      }
    }

    if (this._custom_data) {
      const customDataDB = this._custom_data;
      try {
        customDataDB.delete("tags", groupname);
        return Promise.resolve(true);
      } catch (err) {
        throw new Error("Failed to delete group");
      }
    } else {
      throw new Error("Database error");
    }
  }
  public async updateGroupName(payload: {
    oldGroupName: string;
    newGroupName: string;
  }): Promise<boolean> {
    if (!this._custom_data) {
      try {
        await this.initDB();
      } catch (err) {
        console.log(err);
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
          return Promise.resolve(true);
        } else {
          throw new Error("Group not found");
        }
      } catch (err) {
        throw new Error("Failed to update group name");
      }
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
