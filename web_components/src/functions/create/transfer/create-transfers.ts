import { Mapping } from "@/interfaces/mappings/mapping-interface";
import { CostSplit } from "@/interfaces/misc/costsplit-enum";
import { Currency } from "@/interfaces/misc/currency-enum";
import {
  BasicProperties,
  CostManagementProperties,
  EstimateProperties,
  IBankTransfer,
  RebookingProperties,
  SettingsProperties,
} from "@/interfaces/transfers/transfer-interface";

const version_string = "v1";

export default class Transfer implements IBankTransfer {
  _id: string | null;
  _unique_key: string | null;
  iban: string | null;
  recipientBic: string | null;
  uniqueID: string | null;
  bookDate: Date | null;
  valutaDate: Date | null;
  value: number | null;
  user: string | null;
  account: string | null;
  rebookedFrom: null | string;
  rebookedTo: null | string;
  isActive: boolean;
  readOnly: boolean;
  currency: Currency | null;
  bank: string | null;
  recipient: string | null;
  recipientIdent: string | null;
  recipientIban: string | null;
  purpose: string | null;
  comment: string | null;
  category: Array<string> | Array<never>;
  costSplit: CostSplit | null;
  distributionKey: Array<{ key: string; value: number }> | Array<never>;
  correctionFactor: number | null;
  bookInfo: string | null;
  bookText: string | null;
  isEstimated: boolean;
  estimatedFrom: Date | null;
  estimatedUntil: Date | null;
  estimatedDays: Array<Date> | null;
  dateDay: number | null;
  dateMonth: number | null;
  dateYear: number | null;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  isVirtual: boolean;
  mandatoryReference: string | null;
  customerReference: string | null;
  collectorReference: string | null;
  map_version: string;
  isHidden: boolean;

  constructor(map: Mapping) {
    this._id = null;
    this._unique_key = null;
    this.iban = null;
    this.recipientBic = null;
    this.uniqueID = null;
    this.bookDate = null;
    this.valutaDate = null;
    this.value = null;
    this.user = null;
    this.account = null;
    this.rebookedFrom = null;
    this.rebookedTo = null;
    this.isActive = true;
    this.readOnly = false;
    this.currency = null;
    this.bank = null;
    this.recipient = null;
    this.recipientIdent = null;
    this.recipientIban = null;
    this.purpose = null;
    this.comment = null;
    this.category = [];
    this.costSplit = null;
    this.distributionKey = [];
    this.correctionFactor = null;
    this.bookInfo = null;
    this.bookText = null;
    this.isEstimated = false;
    this.estimatedFrom = null;
    this.estimatedUntil = null;
    this.estimatedDays = [];
    this.dateDay = null;
    this.dateMonth = null;
    this.dateYear = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isFavorite = false;
    this.isVirtual = false;
    this.mandatoryReference = null;
    this.customerReference = null;
    this.collectorReference = null;
    this.map_version = map.map_version;
    this.isHidden = false;
  }
}

function createBasicProperties(): BasicProperties {
  const basicProperties = {
    iban: null,
    recipientBic: null,
    uniqueID: null,
    bookDate: null,
    valutaDate: null,
    value: null,
    account: null,
    currency: null,
    bank: null,
    recipient: null,
    recipientIdent: null,
    recipientIban: null,
    purpose: null,
    bookInfo: null,
    bookText: null,
    mandatoryReference: null,
    customerReference: null,
    collectorReference: null,
  };

  return basicProperties;
}
function createSettingsProperties(mapVersion: string): SettingsProperties {
  const settingsProperties = {
    _id: null,
    _unique_key: null,
    isActive: true,
    readOnly: false,
    user: null,
    isFavorite: false,
    isVirtual: false,
    map_version: mapVersion,
    isHidden: false,
  };

  return settingsProperties;
}
function createRebookingProperties(): RebookingProperties {
  const rebookingsProperties = {
    rebookedFrom: null,
    rebookedTo: null,
  };
  return rebookingsProperties;
}
function createEstimateProperties(): EstimateProperties {
  const estimateProperties = {
    isEstimated: false,
    estimatedFrom: null,
    estimatedUntil: null,
    estimatedDays: null,
  };
  return estimateProperties;
}
function createCostManagementProperties(): CostManagementProperties {
  const costManagementProperties = {
    category: [],
    costSplit: null,
    distributionKey: [],
    correctionFactor: null,
  };
  return costManagementProperties;
}

export function createBlankBankTransfer(map: Mapping): IBankTransfer {
  const blankBankTransfer = {
    comment: null,
    dateDay: null,
    dateMonth: null,
    dateYear: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const blankTransfer: IBankTransfer = {
    ...blankBankTransfer,
    ...createBasicProperties(),
    ...createSettingsProperties(map.map_version),
    ...createRebookingProperties(),
    ...createEstimateProperties(),
    ...createCostManagementProperties(),
  };

  return blankTransfer;
}
