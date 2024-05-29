"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexPhoneNumber = exports.regexEmail = void 0;
var regexEmailValidate = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
var regexPhoneValidate = /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/g;
const regexEmail = (email) => {
    return regexEmailValidate.test(email);
};
exports.regexEmail = regexEmail;
const regexPhoneNumber = (phoneNumber) => {
    return regexPhoneValidate.test(phoneNumber);
};
exports.regexPhoneNumber = regexPhoneNumber;
