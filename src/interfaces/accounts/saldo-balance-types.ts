export interface SingleBalanceObject {
  startBalance: number;
  endBalance: number;
  income: number;
  outgoing: number;
  sum: number;
}
export interface AccountBalanceObject {
  lastMonth: SingleBalanceObject;
  currentMonth: SingleBalanceObject;
}
export interface YearMonthBalanceObject {
  [index: number]: MonthBalanceObject;
}
export interface MonthBalanceObject {
  [index: number]: {
    income: number;
    outgoing: number;
    sum: number;
  };
}
export interface BalanceByYearMonth {
  [index: string]: MonthBalanceObject;
}
export interface SaldoObject {
  [index: number]: {
    start: number | false;
    end: number;
  };
}
export interface SaldoByYearMonth {
  [index: string]: SaldoObject;
}

//For DB
export interface MonthlyBalanceCache {
  id: "MonthlyBalance";
  accountID: string;
  lastModified: number;
  data: MonthBalanceObject;
}
export interface SaldoCache {
  id: "Saldo";
  accountID: string;
  lastModified: number;
  data: SaldoObject;
}
