import { IBasicTransferClass } from "@/interfaces/transfers/transfers";
import { AccountBalanceObject } from "@/worker/message-interfaces/account-assist-interface";

export const getLatestAccountBalance = (
  openingBalance: number,
  relatedTransfers: Array<IBasicTransferClass>
): AccountBalanceObject => {
  const date = new Date();
  const currentMonth = date.getMonth();
  date.setDate(1);
  date.setMonth(currentMonth - 1);
  const lastMonth = date.getMonth();
  const relatedYear = date.getFullYear();

  const beforeTransfers: Array<IBasicTransferClass> = [];
  const lastMonthTransfers: Array<IBasicTransferClass> = [];
  const currentMonthTransfers: Array<IBasicTransferClass> = [];

  relatedTransfers.forEach((transferEntry) => {
    if (
      transferEntry.valutaDate._dateMetaInformation.month === lastMonth &&
      transferEntry.valutaDate._dateMetaInformation.year === relatedYear
    ) {
      lastMonthTransfers.push(transferEntry);
    } else if (
      transferEntry.valutaDate._dateMetaInformation.month === currentMonth &&
      transferEntry.valutaDate._dateMetaInformation.year === relatedYear
    ) {
      currentMonthTransfers.push(transferEntry);
    } else {
      beforeTransfers.push(transferEntry);
    }
  });

  const resultObject = {
    lastMonth: {
      balance: 0,
      income: 0,
      outgoing: 0,
    },
    currentMonth: {
      balance: 0,
      income: 0,
      outgoing: 0,
    },
  };

  const lastMentionedBalance = beforeTransfers.reduce((acc, curr) => {
    return acc + curr.value._value;
  }, openingBalance);

  const lastMonthValues = lastMonthTransfers.reduce<{
    income: number;
    outgoing: number;
  }>(
    (acc, curr) => {
      if (curr.value._value >= 0) {
        acc.income = acc.income + curr.value._value;
        return acc;
      } else if (curr.value._value < 0) {
        acc.outgoing = acc.outgoing + curr.value._value;
        return acc;
      } else {
        return acc;
      }
    },
    { income: 0, outgoing: 0 }
  );

  resultObject.lastMonth.income = lastMonthValues.income;
  resultObject.lastMonth.outgoing = lastMonthValues.outgoing;
  resultObject.lastMonth.balance =
    lastMentionedBalance + lastMonthValues.income + lastMonthValues.outgoing;

  const currentMonthValues = currentMonthTransfers.reduce<{
    income: number;
    outgoing: number;
  }>(
    (acc, curr) => {
      if (curr.value._value >= 0) {
        acc.income = acc.income + curr.value._value;
        return acc;
      } else if (curr.value._value < 0) {
        acc.outgoing = acc.outgoing + curr.value._value;
        return acc;
      } else {
        return acc;
      }
    },
    { income: 0, outgoing: 0 }
  );

  resultObject.currentMonth.income = currentMonthValues.income;
  resultObject.currentMonth.outgoing = currentMonthValues.outgoing;
  resultObject.currentMonth.balance =
    resultObject.lastMonth.balance +
    currentMonthValues.income +
    currentMonthValues.outgoing;

  return resultObject;
};
