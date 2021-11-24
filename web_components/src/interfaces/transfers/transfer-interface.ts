import { CostSplit } from "../misc/costsplit-enum";
import { Currency } from "../misc/currency-enum";

interface CustomTransferProperties {
  comment: string | null;
  dateDay: number | null;
  dateMonth: number | null;
  dateYear: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface EstimateProperties {
  isEstimated: boolean;
  estimatedFrom: Date | null;
  estimatedUntil: Date | null;
  estimatedDays: Array<Date> | null;
}

interface SettingsProperties {
  _id: string | null;
  _unique_key: string | null;
  isActive: boolean;
  readOnly: boolean;
  user: string | null;
  isFavorite: boolean;
  isVirtual: boolean;
}

interface CostManagementProperties {
  category: Array<string> | Array<never>;
  costSplit: CostSplit | null;
  distributionKey: Array<{ key: string; value: number }> | Array<never>;
  correctionFactor: number | null;
}

interface RebookingProperties {
  rebookedFrom: null | string;
  rebookedTo: null | string;
}

interface BasicProperties {
  uniqueID: string | null;
  iban: string | null;
  bookDate: Date | null;
  valutaDate: Date | null;
  value: number | null;
  account: string | null;
  currency: Currency | null;
  bank: string | null;
  recipient: string | null;
  recipientIdent: string | null;
  recipientIban: string | null;
  purpose: string | null;
  bookInfo: string | null;
  bookText: string | null;
  mandatoryReference: string | null;
  customerReference: string | null;
  collectorReference: string | null;
}

type AdditionalTransferProperties = CustomTransferProperties &
  EstimateProperties &
  SettingsProperties &
  RebookingProperties &
  CostManagementProperties;

export type IBankTransfer = BasicProperties & AdditionalTransferProperties;

interface IPropertyMetaData {
  EN: string;
  DE: string;
  visible: boolean;
  printable: boolean;
  readOnly: boolean;
  pinSecured: boolean;
}

export const BankTransferPropertyMap: Record<
  keyof IBankTransfer,
  IPropertyMetaData
> = {
  _id: {
    EN: "Database-ID",
    DE: "Datenbank-ID",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  uniqueID: {
    EN: "Account-ID",
    DE: "Konto-ID",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  iban: {
    EN: "IBAN",
    DE: "IBAN",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  account: {
    EN: "Name",
    DE: "Name",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  _unique_key: {
    EN: "Transfer-ID",
    DE: "Transfer-ID",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  recipientIban: {
    EN: "Recipient-IBAN",
    DE: "Empfänger-IBAN",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  bookDate: {
    EN: "book_date",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  valutaDate: {
    EN: "valuta_date",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  value: {
    EN: "value",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  user: {
    EN: "user",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  rebookedFrom: {
    EN: "rebooked_from",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  rebookedTo: {
    EN: "rebooked_to",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  isActive: {
    EN: "selected",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  readOnly: {
    EN: "readOnlyonly",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  currency: {
    EN: "currency",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  bank: {
    EN: "bank_name",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  recipient: {
    EN: "recipient",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  recipientIdent: {
    EN: "creditor_identification_number",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  purpose: {
    EN: "purpose",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  comment: {
    EN: "comments",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  category: {
    EN: "category",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  costSplit: {
    EN: "cost_split",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  distributionKey: {
    EN: "distribution_key",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  correctionFactor: {
    EN: "correction_factor",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  bookInfo: {
    EN: "book_info",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  bookText: {
    EN: "book_text",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  isEstimated: {
    EN: "is_estimated",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  estimatedFrom: {
    EN: "estimated_start",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  estimatedUntil: {
    EN: "estimated_end",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  estimatedDays: {
    EN: "estimated_duration",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  dateDay: {
    EN: "day",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  dateMonth: {
    EN: "month",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  dateYear: {
    EN: "year",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  createdAt: {
    EN: "created_at",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  updatedAt: {
    EN: "last_update",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  isFavorite: {
    EN: "is_favourite",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  isVirtual: {
    EN: "is_virtual",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  mandatoryReference: {
    EN: "mandatory_ref",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  customerReference: {
    EN: "customer_ref",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
  collectorReference: {
    EN: "collector_ref",
    DE: "",
    visible: true,
    printable: true,
    readOnly: false,
    pinSecured: false,
  },
};

export default class Transfer implements IBankTransfer {
  _id: string | null;
  _unique_key: string | null;
  iban: string | null;
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

  constructor() {
    this._id = null;
    this._unique_key = null;
    this.iban = null;
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
  }
}

function createBasicProperties(): BasicProperties {
  const basicProperties = {
    iban: null,
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
function createSettingsProperties(): SettingsProperties {
  const settingsProperties = {
    _id: null,
    _unique_key: null,
    isActive: true,
    readOnly: false,
    user: null,
    isFavorite: false,
    isVirtual: false,
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

export function createBlankBankTransfer(): IBankTransfer {
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
    ...createSettingsProperties(),
    ...createRebookingProperties(),
    ...createEstimateProperties(),
    ...createCostManagementProperties(),
  };

  return blankTransfer;
}
