import {
  BasicAccountTypes,
  CurrencyValues,
  IBasicAccountClass,
} from "@/interfaces/accounts/accounts";
import { IBasicTransferClass } from "@/interfaces/transfers/transfers";
import { DataFieldType } from "@/interfaces/data-field/data-field-interface";
import * as Comlink from "comlink";
import { getTransferConfig } from "@/utils/config-generator";

const randomNumberGenerator = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const randomValueGenerator = () => {
  let decimal = randomNumberGenerator(1, 99);
  let value = randomNumberGenerator(5, 1800);
  return Number(value + "." + decimal);
};

const randomDateGenerator = () => {
  const year = randomNumberGenerator(2017, 2021);
  const month = randomNumberGenerator(0, 11);
  const day =
    month !== 1 ? randomNumberGenerator(0, 30) : randomNumberGenerator(0, 28);

  const returnDate = new Date(year, month, day);

  return returnDate;
};

const tags = [
  "Food",
  "Insurance",
  "Car",
  "Economy-Costs",
  "Garden",
  "Hobby",
  "Cash",
  "Party",
  "Non-Food",
  "Electronics",
  "Shoes",
  "Clothes",
  "Friends",
  "Birthday",
];
const randomTagsGenerator = () => {
  const amountOfTags = randomNumberGenerator(0, 4);
  const arrayOfTags: Set<string | never> = new Set();

  if (amountOfTags === 0) {
    return [];
  }

  for (let i = 0; i <= amountOfTags; i++) {
    const index = randomNumberGenerator(0, tags.length - 1);
    arrayOfTags.add(tags[index]);
  }

  return Array.from(arrayOfTags.keys());
};

const randomDistKeyGenerator = () => {
  const distKeys = [
    { "House": { electrical: 40, garbage: 10, winter: 10, water: 40 } },
  ];

  return distKeys[0];
};

const getExampleData = (
  accountAmount: number,
  transfersPerAccount: number
): Array<IBasicAccountClass> => {
  const parsedArray = [];

  for (let i = 0; i < accountAmount; i++) {
    const newAccount: IBasicAccountClass = {
      _internalID: {
        _value: i.toString(),
        _type: DataFieldType.ID,
        _readonly: true,
        _visible: false,
        _shared: false,
        _displayName: "internalID",
      },
      _internalType: {
        _value: BasicAccountTypes.DIGITAL_ACCOUNT,
        _type: DataFieldType.ID,
        _readonly: true,
        _visible: false,
        _shared: false,
        _displayName: "internalID",
      },
      provider: {
        _value: "SPK" + i.toString(),
        _type: DataFieldType.STRING,
        _readonly: true,
        _visible: true,
        _shared: true,
        _displayName: "Bank/Account",
      },
      accountNumber: {
        _value: (i * i).toString(),
        _type: DataFieldType.STRING,
        _readonly: true,
        _visible: true,
        _shared: false,
        _displayName: "IBAN/AccountNo.",
      },
      transfers: {
        _value: [] as Array<IBasicTransferClass>,
        _type: DataFieldType.TRANSFERLIST,
        _readonly: true,
        _visible: true,
        _shared: false,
        _displayName: "Transfers",
      },
      shortName: {
        _value: "",
        _type: DataFieldType.STRING,
        _readonly: false,
        _visible: true,
        _shared: true,
        _displayName: "Shortname",
      },
      openingBalance: {
        _value: 50,
        _type: DataFieldType.NUMBER,
        _readonly: false,
        _visible: true,
        _shared: false,
        _displayName: "Opening balance",
      },
      openingBalanceDate: {
        _value: new Date().getTime(),
        _dateMetaInformation: {
          isoString: new Date().toISOString(),
          weekDay: new Date().getDay(),
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        },
        _type: DataFieldType.NUMBER,
        _readonly: false,
        _visible: true,
        _shared: false,
        _displayName: "Opening balance date",
      },
      createdAt: {
        _value: new Date().getTime(),
        _dateMetaInformation: {
          isoString: new Date().toISOString(),
          weekDay: new Date().getDay(),
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        },
        _type: DataFieldType.NUMBER,
        _readonly: true,
        _visible: true,
        _shared: true,
        _displayName: "Created at",
      },
      updatedAt: {
        _value: new Date().getTime(),
        _dateMetaInformation: {
          isoString: new Date().toISOString(),
          weekDay: new Date().getDay(),
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        },
        _type: DataFieldType.NUMBER,
        _readonly: false,
        _visible: true,
        _shared: true,
        _displayName: "Updated at",
      },
      currency: {
        _value: CurrencyValues.EUR,
        _type: DataFieldType.CURRENCY,
        _readonly: false,
        _visible: true,
        _shared: true,
        _displayName: "Currency",
      },
      isSelected: {
        _value: i === 2 ? true : false,
        _type: DataFieldType.CHECKBOX,
        _readonly: false,
        _visible: true,
        _shared: false,
        _displayName: "Selected",
      },
    };

    for (let j = 0; j < transfersPerAccount; j++) {
      const bookDate = randomDateGenerator();
      const valutaDate = randomDateGenerator();
      const newTransfer: IBasicTransferClass = {
        _internalID: {
          _value: i.toString() + j.toString(),
          _type: DataFieldType.ID,
          _readonly: true,
          _visible: false,
          _shared: false,
          _displayName: "internalID",
        },
        provider: {
          _value: "SPK" + i.toString(),
          _type: DataFieldType.STRING,
          _readonly: true,
          _visible: true,
          _shared: true,
          _displayName: "Bank/Account",
        },
        accountNumber: {
          _value: (i * i).toString(),
          _type: DataFieldType.STRING,
          _readonly: true,
          _visible: true,
          _shared: true,
          _displayName: "IBAN/AccountNo.",
        },
        value: {
          _value: randomValueGenerator(),
          _type: DataFieldType.NUMBER,
          _readonly: false,
          _visible: true,
          _shared: true,
          _displayName: "Value [EUR]",
        },
        purpose: {
          _value: (i * i).toString(),
          _type: DataFieldType.TEXTFIELD,
          _readonly: false,
          _visible: true,
          _shared: true,
          _displayName: "Purpose",
        },
        bookDate: {
          _value: bookDate.getTime(),
          _type: DataFieldType.DATE,
          _readonly: true,
          _visible: true,
          _shared: false,
          _displayName: "Date of book (Book date)",
          _dateMetaInformation: {
            isoString: bookDate.toLocaleDateString(),
            weekDay: bookDate.getDate(),
            month: bookDate.getMonth(),
            year: bookDate.getFullYear(),
          },
        },
        valutaDate: {
          _value: valutaDate.getTime(),
          _type: DataFieldType.DATE,
          _readonly: true,
          _visible: true,
          _shared: false,
          _displayName: "Date of credit (valuta date)",
          _dateMetaInformation: {
            isoString: valutaDate.toLocaleDateString(),
            weekDay: valutaDate.getDate(),
            month: valutaDate.getMonth(),
            year: valutaDate.getFullYear(),
          },
        },
        description: {
          _value: "empty",
          _type: DataFieldType.TEXTFIELD,
          _readonly: false,
          _visible: true,
          _shared: true,
          _displayName: "Description",
        },
        tags: {
          _value: randomTagsGenerator(),
          _type: DataFieldType.TAGLIST,
          _readonly: false,
          _visible: true,
          _shared: true,
          _displayName: "Tags",
        },
        distKey: {
          _value: randomDistKeyGenerator(),
          _type: DataFieldType.KEYOBJECT,
          _readonly: false,
          _visible: true,
          _shared: true,
          _displayName: "Distribution key",
        },
        isSelected: {
          _value: false,
          _type: DataFieldType.CHECKBOX,
          _readonly: false,
          _visible: true,
          _shared: false,
          _displayName: "Selected",
        },
        _internalType: {
          _value: BasicAccountTypes.DIGITAL_ACCOUNT,
          _type: DataFieldType.STRING,
          _displayName: "",
          ...getTransferConfig(
            BasicAccountTypes.DIGITAL_ACCOUNT,
            "_internalType"
          ),
        },
        createdAt: {
          _value: new Date().getTime(),
          _type: DataFieldType.NUMBER,
          _displayName: "",
          _dateMetaInformation: {
            isoString: bookDate.toLocaleDateString(),
            weekDay: bookDate.getDate(),
            month: bookDate.getMonth(),
            year: bookDate.getFullYear(),
          },
          ...getTransferConfig(BasicAccountTypes.DIGITAL_ACCOUNT, "createdAt"),
        },
        updatedAt: {
          _value: new Date().getTime(),
          _type: DataFieldType.NUMBER,
          _displayName: "",
          _dateMetaInformation: {
            isoString: bookDate.toLocaleDateString(),
            weekDay: bookDate.getDate(),
            month: bookDate.getMonth(),
            year: bookDate.getFullYear(),
          },
          ...getTransferConfig(BasicAccountTypes.DIGITAL_ACCOUNT, "updatedAt"),
        },
        _accountID: {
          _value: `Test_${j}`,
          _type: DataFieldType.ID,
          _displayName: "",
          ...getTransferConfig(BasicAccountTypes.DIGITAL_ACCOUNT, "_accountID"),
        },
        shortName: {
          _value: `TestName_${j}`,
          _type: DataFieldType.TEXTFIELD,
          _readonly: false,
          _visible: true,
          _shared: true,
          _displayName: "Description",
        },
        currency: {
          _value: CurrencyValues.EUR,
          _type: DataFieldType.TEXTFIELD,
          _readonly: false,
          _visible: true,
          _shared: true,
          _displayName: "Description",
        },
      };
      newAccount.transfers._value.push(newTransfer);
    }
    parsedArray.push(newAccount);
  }

  return parsedArray;
};

const get = {
  examples: (accounts: number, transfers: number) =>
    getExampleData(accounts, transfers),
  randomNumber: randomNumberGenerator,
  getTags: tags,
};

Comlink.expose(get);
