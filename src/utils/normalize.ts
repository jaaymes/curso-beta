export const normalizePhone = (value: string): string => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, "");

  if (onlyNums.length === 0) {
    return "";
  }

  if (onlyNums.length <= 2) {
    return `(${onlyNums.slice(0, 2)}`;
  }

  if (onlyNums.length <= 6 && onlyNums.length > 2) {
    return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 6)}`;
  }

  if (onlyNums.length > 6 && onlyNums.length < 11) {
    return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 6)}-${onlyNums.slice(
      6,
      10,
    )}`;
  }

  return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 7)}-${onlyNums.slice(
    7,
    11,
  )}`;
};