import { CostSplit } from "../misc/costsplit-enum";
import { Currency } from "../misc/currency-enum";

export interface Mapping {
  mapName: string;
  createdAt: Date;
  updatedAt: Date;
  mapping: {
    uniqueID: string;
    bank: string;
    bic: string;
    recipient: string;
    recIdent: string;
    recipientIban: string;
    iban: string;
    value: string;
    purpose: string;
    bookDate: string;
    valutaDate: string;
    currency: string;
    bookText: string;
    bookInfo: string;
    mandatoryReference: string;
    customerReference: string;
    collectorReference: string;
  };
  defaultValues: {
    bank: string;
    bic: string;
    iban: string;
    currency: string;
    recipient: string;
    recIdent: string;
    purpose: string;
    bookText: string;
    bookInfo: string;
  };
}
