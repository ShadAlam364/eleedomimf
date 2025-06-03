// // services/encryption.js
// import dotenv from "dotenv";
// import CryptoJS from 'crypto-js';
// dotenv.config();

// const SECRET_KEY = process.env;

// export const encryptData = (data) => {
//   return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
// };

// export const decryptData = (encrypted) => {
//   const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
//   return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
// };