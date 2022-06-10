//Only Vue Frontend
interface PageObject {
  accountID: string;
  transferID: string;
}

interface MonthPage {
  [index: number]: Array<PageObject>;
}

export interface Pagination {
  [index: number]: MonthPage;
}
