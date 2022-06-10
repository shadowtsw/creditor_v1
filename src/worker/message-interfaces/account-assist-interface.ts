import { Pagination } from "@/interfaces/pages/page-types";
import { IBasicTransferClass } from "@/interfaces/transfers/transfers";

//Worker message related
export enum AAW_MessageTypes {
  INIT = "INIT",
  REQUEST_CALC = "REQUEST_CALC",
  RESPONSE_CALC = "RESPONSE_CALC",
  REQUEST_PAGINATION = "REQUEST_PAGINATION",
  RESPONSE_PAGINATION = "RESPONSE_PAGINATION",
  UPDATE_PAGINATION = "UPDATE_PAGINATION",
  DELETE_FROM_PAGINATION = "DELETE_FROM_PAGINATION",
}

export interface GlobalWorkerMessage {
  type: AAW_MessageTypes;
}

export enum InitMessageTargets {
  TRANSFER_DB = "transferDB",
  ACCOUNT_DB = "accountDB",
}

//INCOMING - messages the worker can receive
export interface InitMessage extends GlobalWorkerMessage {
  type: AAW_MessageTypes.INIT;
  messageData: {
    target: InitMessageTargets;
  };
}

export interface RequestBalanceMessage extends GlobalWorkerMessage {
  type: AAW_MessageTypes.REQUEST_CALC;
  messageData: {
    accountID: string;
  };
}

export interface RequestPaginationMessage extends GlobalWorkerMessage {
  type: AAW_MessageTypes.REQUEST_PAGINATION;
}

export interface UpdatePaginationMessage extends GlobalWorkerMessage {
  type: AAW_MessageTypes.UPDATE_PAGINATION;
  messageData: IBasicTransferClass;
}

export interface DeleteFromPaginationMessage extends GlobalWorkerMessage {
  type: AAW_MessageTypes.DELETE_FROM_PAGINATION;
  messageData: IBasicTransferClass;
}

export type AAWInit = InitMessage;
export type AAWReqBalance = RequestBalanceMessage;
export type AAWReqPagination = RequestPaginationMessage;
export type AAWUpdatePagination = UpdatePaginationMessage;
export type AAWDeleteFromPagination = DeleteFromPaginationMessage;

export type IncomingMessages =
  | AAWInit
  | AAWReqBalance
  | AAWReqPagination
  | AAWUpdatePagination
  | AAWDeleteFromPagination;
//INCOMING - messages the worker can receive

//OUTGOING - messages the worker can send to subscribers
export interface ResponseBalanceMessage extends GlobalWorkerMessage {
  type: AAW_MessageTypes.RESPONSE_CALC;
  messageData: {
    accountID: string;
    data: AccountBalanceObject;
  };
}
export interface ResponsePaginationMessage extends GlobalWorkerMessage {
  type: AAW_MessageTypes.RESPONSE_PAGINATION;
  messageData: Pagination;
}
export type AAWResBalance = ResponseBalanceMessage;
export type AAWResPagination = ResponsePaginationMessage;
export type OutgoingMessages = AAWResBalance | AAWResPagination;
//OUTGOING - messages the worker can send to subscribers

//Misc types
export interface SubscriptionObject {
  id: string;
  callback: Function;
}
export type Subscriptions = {
  ["RESPONSE_CALC"]: Array<SubscriptionObject | never>;
  ["RESPONSE_PAGINATION"]: Array<SubscriptionObject | never>;
};

export interface SingleBalanceObject {
  balance: number;
  income: number;
  outgoing: number;
}

export interface AccountBalanceObject {
  lastMonth: SingleBalanceObject;
  currentMonth: SingleBalanceObject;
}

export interface MonthBalanceObject {
  [index: number]: SingleBalanceObject;
}

export interface YearMonthBalanceObject {
  [index: number]: MonthBalanceObject;
}
