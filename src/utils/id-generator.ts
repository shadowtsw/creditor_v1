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

  const newInternalID = btoa(accountID);

  return newInternalID;
};

export const generateCreditorTransferID = (
  payload: IBasicTransferConstructorConfig
) => {
  const prefix =
    userName.trim().length > 10
      ? userName.trim().slice(0, 10)
      : userName.trim();

  // const firstPart = payload.valutaDate.getTime().toString().trim();
  // const secondPart = payload.accountNumber.trim();
  // const thirdPart = payload._internalType;
  // const fourthPart = payload.value.toString();
  // const fifthPart =
  //   payload.purpose.trim().length > 20
  //     ? payload.purpose.trim().slice(0, 20)
  //     : payload.purpose.trim();
  // const sixthPart = payload._accountID;

  // const transferID =
  //   prefix +
  //   firstPart +
  //   secondPart +
  //   thirdPart +
  //   fourthPart +
  //   fifthPart +
  //   sixthPart;

  const transferID = prefix + JSON.stringify(payload);

  const newInternalID = btoa(transferID);

  return newInternalID;
};
