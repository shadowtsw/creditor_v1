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

//Only Vue Frontend
// export interface PageObject {
//   accountID: string;
//   transferID: string;
// }

interface MonthPage {
  [index: number]: Array<PageObject>;
}

export interface Pagination {
  [index: number]: MonthPage;
}

//For DB
export interface PageCache {
  id: "Pagination";
  lastModified: number;
  data: Pagination;
}
