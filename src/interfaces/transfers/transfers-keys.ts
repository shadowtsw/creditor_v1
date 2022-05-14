//TODO
import { IBasicTransfer, IFullTransfer, IMediumTransfer } from "./transfers";

type BasicTransferKeys = keyof IBasicTransfer;

export interface BasicTransferField {
  inputKey: string;
  appKey: BasicTransferKeys;
  displayName: string;
}

type MediumTransferKeys = keyof IMediumTransfer;

interface MediumTransferField {
  inputKey: string;
  appKey: MediumTransferKeys;
  displayName: string;
}

type FullTransferKeys = keyof IFullTransfer;

interface FullTransferField {
  inputKey: string;
  appKey: FullTransferKeys;
  displayName: string;
}

//Cash keys
export function getBasicTransferFields() {
  const IBasicTransferFields: Array<BasicTransferField> = [
    {
      inputKey: "",
      appKey: "ID",
      displayName: "ID",
    },
    {
      inputKey: "",
      appKey: "description",
      displayName: "Description",
    },
    {
      inputKey: "",
      appKey: "tags",
      displayName: "Tags",
    },
    {
      inputKey: "",
      appKey: "purpose",
      displayName: "Purpose",
    },
    {
      inputKey: "",
      appKey: "value",
      displayName: "Value [EUR]",
    },
    {
      inputKey: "",
      appKey: "valutaDate",
      displayName: "Date of credit (valuta date)",
    },
    {
      inputKey: "",
      appKey: "distKey",
      displayName: "Distribution key",
    },
  ];

  return IBasicTransferFields;
}
//Featured accounts
export function getMediumTransferFields() {
  const IMediumTransferFields: Array<MediumTransferField> = [
    ...getBasicTransferFields(),
    {
      inputKey: "",
      appKey: "provider",
      displayName: "provider",
    },
    {
      inputKey: "",
      appKey: "accountNumber",
      displayName: "accountNumber",
    },
    {
      inputKey: "",
      appKey: "bookDate",
      displayName: "bookDate",
    },
  ];

  return IMediumTransferFields;
}
//Full bank accounts
export function getFullTransferFields() {
  const IFullTransferFields: Array<FullTransferField> = [
    ...getMediumTransferFields(),
  ];

  return IFullTransferFields;
}
