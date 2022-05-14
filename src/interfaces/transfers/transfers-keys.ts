//TODO
import { IBasicTransferClass } from "./transfers";

export interface ITransferMapObject {
  inputKey: string;
  appKey: keyof IBasicTransferClass;
  displayName: string;
}

//Cash keys
export function getBasicTransferFields() {
  const IBasicTransferFields: Array<ITransferMapObject> = [
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

  return IBasicTransferFields;
}
