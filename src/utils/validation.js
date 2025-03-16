export const validateMobileNumber = (mobileNumber) => {
  const mobileNumberRegex =
    /^(\+?\d{1,4}[\s-])?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,10}$/;
  return mobileNumberRegex.test(mobileNumber);
};

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};


export const isValidName = (name) => {
  const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces allowed
  return nameRegex.test(name);
};

export const validateInput = (input) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Simple email validation
  const phoneRegex = /^(\+?\d{1,4}[\s-])?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,10}$/; // Mobile numbers (10-15 digits)

  if (emailRegex.test(input)) {
    return "email";
  } else if (phoneRegex.test(input)) {
    return "mobile";
  } else {
    return "invalid";
  }
};

export const validateIndianPostalCode = (postalCode) => {
  const indianPostalCodeRegex = /^\d{6}$/;
  return indianPostalCodeRegex.test(postalCode);
};

export const validateMinutes = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num >= 1 && num <= 120;
};

export const isValidNumber = (value) => {
  return /^[0-9]+$/.test(value);
};

export const validatePetAge = (age) => {
  const petAge = Number(age);

  if (isNaN(petAge)) {
    return "invalid";
  }
  if (petAge < 0) {
    return "invalid"
  }
  if (petAge > 30) {
     return "invalid"
  }
  
  return ""; // Valid age
}