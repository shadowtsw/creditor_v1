import { IBasicAccountConstructorConfig } from "@/interfaces/accounts/accounts";
import { BasicDataField } from "@/interfaces/data-field/data-field-interface";
import { AvailableTags, TagsObject } from "@/store/sub-data/sub-data-types";
import { DBSchema } from "idb";

//TODO
export interface IDBAppData extends DBSchema {
  tags: {
    value: TagsObject;
    key: string;
    indexes: { groupname: string; tags: Array<string> };
  };
  distKeys: {
    value: any;
    key: string;
    indexes: { id: string };
  };
}
export interface IDBUserData extends DBSchema {
  init: {
    value: any;
    key: string;
    indexes: { name: string; description: string };
  };
}
export interface IDBAccounts extends DBSchema {
  basic_account: {
    value: any;
    key: string;
    indexes: {};
  };
}
export interface IDBTransfers extends DBSchema {
  basic_account: {
    value: any;
    key: string;
    indexes: {};
  };
}
