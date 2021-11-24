import { IBankTransfer } from "../transfers/transfer-interface";

type Naspa = Partial<Record<keyof IBankTransfer, string>>;

export const sparkasse_naspa_v1: Naspa = {
  "uniqueID": "Auftragskonto",
  "recipientBic": "BIC (SWIFT-Code)",
  "recipient": "Beguenstigter/Zahlungspflichtiger",
  "recipientIdent": "Glaeubiger ID",
  "recipientIban": "Kontonummer/IBAN",
  "value": "Betrag",
  "purpose": "Verwendungszweck",
  "bookDate": "Buchungstag",
  "valutaDate": "Valutadatum",
  "currency": "Waehrung",
  "bookText": "Buchungstext",
  "mandatoryReference": "Mandatsreferenz",
  "customerReference": "Kundenreferenz (End-to-End)",
  "collectorReference": "Sammlerreferenz",
};
