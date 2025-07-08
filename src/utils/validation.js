// src/utils/validation.js

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // South African phone number format
  const phoneRegex = /^(\+27|0)[1-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateVATNumber = (vatNumber) => {
  // South African VAT number format
  const vatRegex = /^[4-7]\d{9}$/;
  return vatRegex.test(vatNumber);
};

export const validateCurrency = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0 && num <= 999999999;
};

export const validateFundingValue = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 10000 && num <= 10000000000; // R10k to R10B
};

export const validateHourlyRate = (rate) => {
  const num = parseFloat(rate);
  return !isNaN(num) && num >= 100 && num <= 10000; // R100 to R10k per hour
};

export const validateComplexity = (complexity) => {
  const valid = [1, 1.5, 2];
  return valid.includes(parseFloat(complexity));
};

export const validateRequiredField = (value) => {
  return value && value.toString().trim().length > 0;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export const formatCurrency = (amount, currency = 'ZAR') => {
  try {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

export const formatNumber = (number) => {
  try {
    return new Intl.NumberFormat('en-ZA').format(number);
  } catch (error) {
    return number.toString();
  }
};