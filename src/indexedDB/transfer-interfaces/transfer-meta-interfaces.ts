//Pages types for database
export interface PageObject {
  accountID: string;
  transferID: string;
  yearMonth: number;
  year: number;
  month: number;
}

export type Page = {
  yearMonth: number;
  transfers: Array<PageObject>;
  year: number;
  month: number;
};

export interface Pages {
  [index: string]: Array<PageObject>;
}
