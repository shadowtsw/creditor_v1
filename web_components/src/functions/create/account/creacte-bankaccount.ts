import { IBankAccount } from "@/interfaces/accounts/account-interface";
import { Mapping } from "@/interfaces/mappings/mapping-interface";

export function createBankAccount(map: Mapping): IBankAccount {
  const newBlankAccount: IBankAccount = {
    _id: null,
    _unique_key: null,
    bank: null,
    iban: null,
    swift_bic: null,
    customName: null,
    transfers: [],
    user: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    mappings: [],
    openingBalance: null,
    openingBalanceDate: null,
    currency: null,
    isVirtual: false,
    isChild: false,
    relatedToParent: false,
  };

  newBlankAccount.mappings.push(map);

  return newBlankAccount;
}
