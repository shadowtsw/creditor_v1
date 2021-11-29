import { IBankTransfer } from "@/interfaces/transfers/transfer-interface";

export interface UniqueIDObject {
  _unique_key: string;
  level: number;
}

export const convertToBase64 = (uniqueID: string) => {
  return btoa(uniqueID);
};

export const convertToString = (base64UniqueID: string) => {
  return atob(base64UniqueID);
};

export const transferUniqueIdGenerator = (
  transfer: IBankTransfer,
  level?: number
): UniqueIDObject => {
  //Lvl1
  const iban = transfer.iban;
  const value = transfer.value;
  const bookDate = transfer.bookDate;
  //Lvl 2
  const purpose = transfer.purpose;
  //Lvl 3
  const recipientIban = transfer.recipientIban;
  const recipientIdent = transfer.recipientIdent;

  if (!iban || !value || !bookDate) {
    throw new Error(
      "Not able to generate UniqueID, check iban, value or book-date"
    );
  }
  const levelOne = iban
    .trim()
    .concat(value.toString().trim(), bookDate.getTime().toString().trim());

  if (level === 1 || !purpose) {
    return {
      _unique_key: convertToBase64(levelOne),
      level: 1,
    };
  }

  const levelTwo = levelOne.concat(purpose.trim());

  if (level === 2 || !recipientIban || !recipientIdent) {
    return {
      _unique_key: convertToBase64(levelTwo),
      level: 2,
    };
  }

  const levelThree = levelTwo.concat(
    recipientIban.trim(),
    recipientIdent.trim()
  );

  return {
    _unique_key: convertToBase64(levelThree),
    level: 3,
  };
};
