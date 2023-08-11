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

export const normalizeCardNumber = (value: string): string => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, "");

  if (onlyNums.length === 0) {
    return "";
  }

  if (onlyNums.length <= 4) {
    return `${onlyNums.slice(0, 4)}`;
  }

  if (onlyNums.length <= 8 && onlyNums.length > 4) {
    return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 8)}`;
  }

  if (onlyNums.length > 8 && onlyNums.length < 12) {
    return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 8)} ${onlyNums.slice(
      8,
      12,
    )}`;
  }

  return `${onlyNums.slice(0, 4)} ${onlyNums.slice(4, 8)} ${onlyNums.slice(
    8,
    12,
  )} ${onlyNums.slice(12, 16)}`;
};

export const normalizeCardExpire = (value: string): string => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, "");

  if (onlyNums.length === 0) {
    return "";
  }

  if (onlyNums.length <= 2) {
    return `${onlyNums.slice(0, 2)}`;
  }

  if (onlyNums.length > 2 && onlyNums.length < 5) {
    return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}`;
  }

  return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}`;
};

export const getCardType = (cardNumber: string): string => {
  const cardType = creditCardType(cardNumber);
  if (cardType[0]) {
    return cardType[0].type;
  }
  return "unknown";
};

export const creditCardType = (cardNumber: string): any => {
  const cardTypes = [
    {
      type: "maestro",
      pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
    },
    {
      type: "visa",
      pattern: /^4/,
    },
    {
      type: "mastercard",
      pattern: /^5[1-5]/,
    },
    {
      type: "amex",
      pattern: /^3[47]/,
    },
    {
      type: "discover",
      pattern: /^6(?:011|5)/,
    },
    {
      type: "diners",
      pattern: /^3(?:0[0-5]|[68])/,
    },
    {
      type: "jcb",
      pattern: /^35/,
    },
    {
      type: "unionpay",
      pattern: /^(62|88)/,
    },
    {
      type: "mir",
      pattern: /^220[0-4]/,
    },
    {
      type: "elo",
      pattern: /^4(?:[035]|88)|^(?:636368|438935|504175|451416|636297)/,
    },
    {
      type: "hiper",
      pattern: /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
    },
    {
      type: "hipercard",
      pattern: /^(384100|384140|384160|606282|637095|637568|60(?!11))/,
    },
  ];

  return cardTypes.filter((cardType) => cardType.pattern.test(cardNumber));
}

export const normalizeCEP = (value: string): string => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, "");

  if (onlyNums.length === 0) {
    return "";
  }

  if (onlyNums.length <= 5) {
    return `${onlyNums.slice(0, 5)}`;
  }

  if (onlyNums.length > 5 && onlyNums.length < 9) {
    return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5, 8)}`;
  }

  return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5, 8)}`;
};


export const calculateAge = (birthday: string): number => {
  const birthdayDate = new Date(birthday);
  const ageDifMs = Date.now() - birthdayDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const normalizePrice = (value: string): string => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, "");

  if (onlyNums.length === 0) {
    return "";
  }

  if (onlyNums.length <= 2) {
    return `${onlyNums.slice(0, 2)}`;
  }

  if (onlyNums.length > 2 && onlyNums.length < 6) {
    return `${onlyNums.slice(0, 2)},${onlyNums.slice(2, 5)}`;
  }

  if (onlyNums.length > 5 && onlyNums.length < 9) {
    return `${onlyNums.slice(0, 2)},${onlyNums.slice(
      2,
      5,
    )},${onlyNums.slice(5, 8)}`;
  }

  if (onlyNums.length > 8 && onlyNums.length < 12) {
    return `${onlyNums.slice(0, 2)},${onlyNums.slice(
      2,
      5,
    )},${onlyNums.slice(5, 8)},${onlyNums.slice(8, 11)}`;
  }

  return `${onlyNums.slice(0, 2)},${onlyNums.slice(
    2,
    5,
  )},${onlyNums.slice(5, 8)},${onlyNums.slice(8, 11)},${onlyNums.slice(
    11,
    14,
  )}`;
};