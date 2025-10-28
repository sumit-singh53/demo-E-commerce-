// Enhanced form validation utilities
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validatePhone(phone) {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10;
}

export function validateCardNumber(cardNumber) {
  const cleanCard = cardNumber.replace(/\s/g, '');
  return /^\d{16}$/.test(cleanCard);
}

export function validateExpiryDate(expiryDate) {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
    return false;
  }
  
  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  const expYear = parseInt(year, 10);
  const expMonth = parseInt(month, 10);
  
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return false;
  }
  
  return true;
}

export function validateCVV(cvv) {
  return /^\d{3,4}$/.test(cvv);
}

export function validateRequired(value, minLength = 1) {
  return value && value.trim().length >= minLength;
}

export function validatePinCode(pinCode) {
  return /^\d{6}$/.test(pinCode);
}
