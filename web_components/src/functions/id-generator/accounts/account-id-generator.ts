import { IBankAccount } from "@/interfaces/accounts/account-interface";

type RequiredDetails = Pick<IBankAccount, "iban" | "bank">;

export const convertToBase64 = (uniqueID: string) => {
  return btoa(uniqueID);
};

export const convertToString = (base64UniqueID: string) => {
  return atob(base64UniqueID);
};

export const transferUniqueIdGenerator = (accountDetails: RequiredDetails) => {
  return convertToBase64(
    accountDetails.bank.trim().concat(accountDetails.iban.trim())
  );
};
