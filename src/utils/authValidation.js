/*
  Form validation for the auth pages. Pure functions: each returns an error
  message string ('' when the value is fine). The backend applies the same rules.
*/

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export const normalizeEmail = (value) => String(value ?? '').trim().toLowerCase();

export const getPasswordChecks = (password = '') => [
  { key: 'length', label: '8 to 72 characters', ok: password.length >= 8 && password.length <= 72 },
  { key: 'letter', label: 'At least one letter', ok: /[A-Za-z]/.test(password) },
  { key: 'number', label: 'At least one number', ok: /\d/.test(password) },
];

export const isStrongPassword = (password) => getPasswordChecks(password).every((c) => c.ok);

export const validateEmail = (value) => {
  const email = normalizeEmail(value);
  if (!email) return 'Enter your email address.';
  if (email.length > 254 || !EMAIL_REGEX.test(email)) return 'Enter a valid email address.';
  return '';
};

/** Validates one register field. `values` holds every field (needed for "confirm"). */
export const validateRegisterField = (field, values) => {
  switch (field) {
    case 'name': {
      const name = String(values.name ?? '').trim();
      if (!name) return 'Enter your name.';
      if (name.length < 2) return 'Name must be at least 2 characters.';
      if (name.length > 50) return 'Name must be 50 characters or fewer.';
      return '';
    }
    case 'username': {
      const username = String(values.username ?? '').trim();
      if (!username) return 'Choose a username.';
      if (username.length < 3 || username.length > 20) return 'Username must be 3 to 20 characters.';
      if (!USERNAME_REGEX.test(username)) return 'Use only letters, numbers and underscores.';
      return '';
    }
    case 'email':
      return validateEmail(values.email);
    case 'password': {
      const password = String(values.password ?? '');
      if (!password) return 'Create a password.';
      const failing = getPasswordChecks(password).find((c) => !c.ok);
      return failing ? `Password needs: ${failing.label.toLowerCase()}.` : '';
    }
    case 'confirm':
      if (!values.confirm) return 'Repeat your password.';
      if (values.confirm !== values.password) return "Passwords don't match.";
      return '';
    default:
      return '';
  }
};

const REGISTER_FIELDS = ['name', 'username', 'email', 'password', 'confirm'];

export const validateRegister = (values) => {
  const errors = {};
  REGISTER_FIELDS.forEach((field) => {
    const message = validateRegisterField(field, values);
    if (message) errors[field] = message;
  });
  return errors;
};

export const validateLogin = ({ email, password }) => {
  const errors = {};
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  if (!password) errors.password = 'Enter your password.';
  return errors;
};

/** Which field a server message is about, so it can be shown under that field. */
export const fieldForServerMessage = (message = '') => {
  if (/username/i.test(message)) return 'username';
  if (/email/i.test(message)) return 'email';
  if (/password/i.test(message)) return 'password';
  if (/\bname\b/i.test(message)) return 'name';
  return null;
};