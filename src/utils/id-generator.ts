import { IBasicAccountConstructorConfig } from "@/interfaces/accounts/accounts";
import { IBasicTransferConstructorConfig } from "@/interfaces/transfers/transfers";

//TODO NOTE: Needs update, use real username
const userName = "Timmy L.";

//WARNING: NEVER CHANGE THIS STRUCTURE, IT WILL BRAKE EVERYTHING
export const generateCreditorAccountID = (
  payload: IBasicAccountConstructorConfig
): string => {
  const prefix =
    userName.trim().length > 10
      ? userName.trim().slice(0, 10)
      : userName.trim();
  let firstPart;
  let secondPart;

  if (payload.provider && payload.provider !== "") {
    firstPart = payload.provider.trim();
  } else {
    firstPart = payload.shortName;
  }

  if (payload.accountNumber && payload.accountNumber !== "") {
    secondPart = payload.accountNumber.trim();
  } else {
    secondPart = payload.shortName;
  }

  const thirdPart = payload._internalType;

  const accountID = prefix + firstPart + secondPart + thirdPart;

  const newInternalID = window.btoa(accountID);

  return newInternalID;
};

export const generateCreditorTransferID = (
  payload: IBasicTransferConstructorConfig
) => {
  const prefix =
    userName.trim().length > 10
      ? userName.trim().slice(0, 10)
      : userName.trim();
  let firstPart;
  let secondPart;
  const thirdPart = payload._internalType;
  const fourthPart = payload.value.toString();
  let fifthPart;

  if (payload.valutaDate) {
    firstPart = payload.valutaDate.getTime().toString().trim();
  } else {
    firstPart = payload.shortName.trim();
  }

  if (payload.accountNumber && payload.accountNumber !== "") {
    secondPart = payload.accountNumber.trim();
  } else {
    secondPart = payload.shortName.trim();
  }

  if (payload.purpose && payload.purpose !== "") {
    secondPart =
      payload.purpose.trim().length > 10
        ? payload.purpose.trim().slice(0, 10)
        : payload.purpose.trim();
  } else {
    secondPart = payload.shortName.trim();
  }

  const transferID =
    prefix + firstPart + secondPart + thirdPart + fourthPart + fifthPart;

  const newInternalID = window.btoa(transferID);

  return newInternalID;
};
