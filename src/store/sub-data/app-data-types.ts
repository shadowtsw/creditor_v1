export interface TagsObject {
  id: string;
  groupname: string | "default";
  tags: Array<string | never>;
}

export type AvailableTags = Array<TagsObject>;

export interface DistKeyObject {
  distKeyName: string;
  keys: {
    [index: string]: number;
  };
}

export type AvailableKeys = Array<DistKeyObject>;
