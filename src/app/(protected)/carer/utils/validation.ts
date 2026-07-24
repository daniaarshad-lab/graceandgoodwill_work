export function validateProfileForm(_data: {
  experience: string;
  bio: string;
  address: string;
}) {
  return {};
}

/**
 * Validates a UK National Insurance Number.
 * Expected format: 2 letters, 6 digits, 1 letter.
 * Example: AB123456C
 */
export const isValidNINumber = (niNumber: string): boolean => {
  const stripped = niNumber.replace(/\s/g, "");
  return /^[A-Z]{2}\d{6}[A-Z]$/i.test(stripped);
};
