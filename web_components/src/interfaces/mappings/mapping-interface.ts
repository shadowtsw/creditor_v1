import { IBankTransfer } from "../transfers/transfer-interface";

export interface RequiredMapping {
  uniqueID: string;
  value: string;
  bookDate: string;
  purpose: string;
}

export type GlobalMapping = Partial<Record<keyof IBankTransfer, string>> &
  Required<Record<keyof RequiredMapping, string>>;

export type DefaultValues = Partial<Record<keyof IBankTransfer, string>>;

export interface Mapping {
  mapName: string;
  createdAt: Date;
  updatedAt: Date;
  mapping: GlobalMapping;
  map_version: string;
  defaultValues: DefaultValues | null;
}
