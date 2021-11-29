import { IBankTransfer } from "../transfers/transfer-interface";
import { Mapping } from "../mappings/mapping-interface";
import { Currency } from "../misc/currency-enum";

export interface IBankAccount {
  _id: string | null;
  _unique_key: string;
  bank: string;
  iban: string;
  transferIbanToAccountIban: Array<string | never>;
  swift_bic: string | null;
  customName: string | null;
  transfers: Array<IBankTransfer | never>;
  user: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  mappings: Array<Mapping | never>;
  openingBalance: number | null;
  openingBalanceDate: Date | null;
  currency: Currency | null;
  isVirtual: boolean;
  isChild: boolean;
  relatedToParent: string | boolean;
}
