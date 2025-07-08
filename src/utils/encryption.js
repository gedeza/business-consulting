
// src/utils/encryption.js
import CryptoJS from 'crypto-js';

// Generate a more secure key (in production, use environment variables)
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'SA-Business-Consulting-App-2025-SecureKey';

export const encrypt = (text) => {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid input for encryption');
    }
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Data encryption failed');
  }
};

export const decrypt = (encryptedText) => {
  try {
    if (!encryptedText || typeof encryptedText !== 'string') {
      return null;
    }
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

// Utility function to safely parse JSON with fallback
export const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parsing failed:', error);
    return fallback;
  }
};
