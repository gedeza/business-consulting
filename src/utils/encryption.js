
// src/utils/encryption.js

const XOR_KEY = 'your_super_secret_key'; // In a real application, this should be securely managed

export const encrypt = (text) => {
  return btoa(text.split('').map((char, i) =>
    String.fromCharCode(char.charCodeAt(0) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length))
  ).join(''));
};

export const decrypt = (encryptedText) => {
  try {
    const decrypted = atob(encryptedText).split('').map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length))
    ).join('');
    return decrypted;
  } catch (e) {
    console.error("Decryption failed:", e);
    return null; // Handle decryption errors gracefully
  }
};
