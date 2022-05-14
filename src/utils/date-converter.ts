//Convert date string format
export const convertDate = (dateString: string): Date | null => {
  let newDateString = dateString.trim().replace(/\.|,|\/|\\/g, "-");
  if (
    newDateString.split("-").length === 3 &&
    newDateString.split("-")[2].length > 3
  ) {
    return new Date(newDateString);
  } else {
    return null;
  }
};
