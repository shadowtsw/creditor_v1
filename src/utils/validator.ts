import { convertDate } from "@/utils/date-converter";

export const useValidator = () => {
  //Validator functions
  const validString = (payload: string) => {
    return payload.length >= 3;
  };
  const validNumber = (payload: unknown) => {
    return !isNaN(Number(payload));
  };
  const validDate = (payload: string) => {
    return convertDate(payload) instanceof Date;
  };

  return {
    validString,
    validNumber,
    validDate,
  };
};
