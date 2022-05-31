import { getBasicTransferFields } from "@/interfaces/transfers/transfers-keys";
import Papa from "papaparse";

const parsingResult = [];

export function parseCSV(csv: File, fieldReadyCallback: Function) {
  const newParseObject = {
    date: new Date(),
    fields: [],
    rowsResult: [],
  };

  let isFirstRow = true;

  Papa.parse(csv, {
    header: true,
    step: function (row: any) {
      if (isFirstRow) {
        const fields = row.meta.fields;
        newParseObject.fields = fields;
        fieldReadyCallback(fields);
        isFirstRow = false;
      }
      console.log("Row", row);
    },
    complete: function (results: any) {
      console.log("Complete");
      // resolve(true);
    },
    error: function (error, file) {
      console.log("Error");
      // reject(error);
    },
  });
}
