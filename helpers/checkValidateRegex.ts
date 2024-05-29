var regexEmailValidate = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
var regexPhoneValidate = /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/g;

export const regexEmail = (email) => {
  return regexEmailValidate.test(email);
};

export const regexPhoneNumber = (phoneNumber) => {
  return regexPhoneValidate.test(phoneNumber);
};
