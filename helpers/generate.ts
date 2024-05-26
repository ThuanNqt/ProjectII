export const generateRandomString = (length) => {
  let result: string = "";
  const characters: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateRandomNumber = (length) => {
  let result = "";
  const stringRandom = "0123456789";
  const strLength = stringRandom.length;
  for (let i = 0; i < length; i++) {
    result += stringRandom.charAt(Math.floor(Math.random() * strLength));
  }
  return result;
};
