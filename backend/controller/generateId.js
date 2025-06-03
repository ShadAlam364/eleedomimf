// idGenerator.js

let uniqueIdCounter = 0;

export const generateUniqueId = () => {
  const uniqueId = `br-${uniqueIdCounter}`;
  uniqueIdCounter += 1;
  return uniqueId;
};

let empsIdCounter = 0;
export const generateEmpId = () => {
  const empsId = `emp-${empsIdCounter}`;
  empsIdCounter += 1;
  return empsId;
};




// Helper function to generate a random string of a given length
export function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

// Helper function to generate a random string of digits of a given length
export function generateRandomNumberString(length) {
  const numbers = '0123456789';
  let randomNumberString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    randomNumberString += numbers.charAt(randomIndex);
  }
  return randomNumberString;
}

// Function to generate a password based on email
export function generatePassword(email) {
  const username = email.split('@')[0].slice(0, 3);
  const randomCharsAndNumbers = generateRandomString(2) + generateRandomNumberString(5);
  return `${username}${randomCharsAndNumbers}`;
}
