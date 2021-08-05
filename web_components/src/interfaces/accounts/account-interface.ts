import { Transfer } from '../transfers/transfer-interface';
import { Mapping } from '../mappings/mapping-interface';
import { Currency } from '../misc/currency-enum';

export interface Account {
  _id: string;
  bank: string;
  iban: string;
  swift_bic: string;
  customName: string;
  transfers: Array<Transfer | never>;
  user: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  mapping: Mapping;
  openingBalance: number;
  openingBalanceDate: Date;
  currency: Currency;
  isVirtual: boolean;
  isChild: boolean;
  relatedToParent: string | boolean;
}
