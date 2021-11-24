import { IPropertyMetaData } from "../meta/meta-data";
import { CostSplit } from "../misc/costsplit-enum";
import { Currency } from "../misc/currency-enum";

export interface CustomTransferProperties {
  comment: string | null;
  dateDay: number | null;
  dateMonth: number | null;
  dateYear: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CustomTransferPropertiesMetaData = Record<
  keyof CustomTransferProperties,
  IPropertyMetaData
>;

export interface EstimateProperties {
  isEstimated: boolean;
  estimatedFrom: Date | null;
  estimatedUntil: Date | null;
  estimatedDays: Array<Date> | null;
}

export type EstimatePropertiesMetaData = Record<
  keyof EstimateProperties,
  IPropertyMetaData
>;

export interface SettingsProperties {
  _id: string | null;
  _unique_key: string | null;
  isActive: boolean;
  readOnly: boolean;
  user: string | null;
  isFavorite: boolean;
  isVirtual: boolean;
  version: string;
}

export type SettingsPropertiesMetaData = Record<
  keyof SettingsProperties,
  IPropertyMetaData
>;

export interface CostManagementProperties {
  category: Array<string> | Array<never>;
  costSplit: CostSplit | null;
  distributionKey: Array<{ key: string; value: number }> | Array<never>;
  correctionFactor: number | null;
}

export type CostManagementPropertiesMetaData = Record<
  keyof CostManagementProperties,
  IPropertyMetaData
>;

export interface RebookingProperties {
  rebookedFrom: null | string;
  rebookedTo: null | string;
}

export type RebookingPropertiesMetaData = Record<
  keyof RebookingProperties,
  IPropertyMetaData
>;

export interface BasicProperties {
  uniqueID: string | null;
  iban: string | null;
  recipientBic: string | null;
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

export type BasicPropertiesMetaData = Record<
  keyof BasicProperties,
  IPropertyMetaData
>;

export type AdditionalTransferPropertiesMetaData =
  CustomTransferPropertiesMetaData &
    EstimatePropertiesMetaData &
    SettingsPropertiesMetaData &
    RebookingPropertiesMetaData &
    CostManagementPropertiesMetaData;

export type AdditionalTransferProperties = CustomTransferProperties &
  EstimateProperties &
  SettingsProperties &
  RebookingProperties &
  CostManagementProperties;

export type IBankTransferMetaData = BasicPropertiesMetaData &
  AdditionalTransferPropertiesMetaData;
export type IBankTransfer = BasicProperties & AdditionalTransferProperties;
