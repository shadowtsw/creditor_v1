import { Pagination } from "@/interfaces/transfers/page-types";
import { IBasicTransferClass } from "@/interfaces/transfers/transfers";
import { AccountBalanceObject } from "@/interfaces/accounts/saldo-balance-types";

//Worker message related
export enum AAW_MessageTypes {
  INIT = "INIT",
  REQUEST_CALC = "REQUEST_CALC",
  RESPONSE_CALC = "RESPONSE_CALC",
  REQUEST_PAGINATION = "REQUEST_PAGINATION",
  RESPONSE_PAGINATION = "RESPONSE_PAGINATION",
  UPDATE_PAGINATION = "UPDATE_PAGINATION",
  DELETE_FROM_PAGINATION = "DELETE_FROM_PAGINATION",
  ADD_TRANSFER = "ADD_TRANSFER",
  DELETE_TRANSFER = "DELETE_TRANSFER",
  RESPONSE_INIT_READY = "RESPONSE_INIT_READY",
}

export interface GlobalWorkerMessage {
  type: AAW_MessageTypes;
}

export enum InitMessageTargets {
  // TRANSFER_DB = "transferDB",
  // ACCOUNT_DB = "accountDB",
  INIT_DB = "INIT_DB",
  INIT_APP = "INIT_APP",
  INIT_MODE_APP = "INIT_MODE_APP",
  INIT_MODE_DEMO = "INIT_MODE_DEMO",
}

export enum InitModes {
  APP = "APP",
  DEMO = "DEMO",
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

export interface AddTransferMessage extends GlobalWorkerMessage {
  type: AAW_MessageTypes.ADD_TRANSFER;
  messageData: IBasicTransferClass | Array<IBasicTransferClass>;
}

export interface DeleteTransferMessage extends GlobalWorkerMessage {
  type: AAW_MessageTypes.DELETE_TRANSFER;
  messageData: IBasicTransferClass;
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
export type AAWAddTransfer = AddTransferMessage;

export type IncomingMessages =
  | AAWInit
  | AAWReqBalance
  | AAWReqPagination
  | AAWUpdatePagination
  | AAWDeleteFromPagination
  | AAWAddTransfer;
//INCOMING - messages the worker can receive

//OUTGOING - messages the worker can send to subscribers
export interface ResponseInit extends GlobalWorkerMessage {
  type: AAW_MessageTypes.RESPONSE_INIT_READY;
}
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

export type AAWResInitReady = ResponseInit;
export type AAWResBalance = ResponseBalanceMessage;
export type AAWResPagination = ResponsePaginationMessage;
export type OutgoingMessages =
  | AAWResInitReady
  | AAWResBalance
  | AAWResPagination;
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
