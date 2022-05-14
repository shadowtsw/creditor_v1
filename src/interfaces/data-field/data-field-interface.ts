export enum DataFieldType {
  ID = "_ID",
  STRING = "string",
  NUMBER = "number",
  TRANSFERLIST = "transferlist",
  TAGLIST = "taglist",
  KEYOBJECT = "keyobject",
  CURRENCY = "currency",
  CHECKBOX = "checkbox",
  TEXTFIELD = "textfield",
  DATE = "datemillis",
}

export interface BasicDataField {
  _displayName: string;
  _visible: boolean;
  readonly _type: DataFieldType;
  readonly _readonly: boolean;
  readonly _shared: boolean;
}

export interface BasicTimeField {
  isoString: string;
  weekDay: number;
  month: number;
  year: number;
}
