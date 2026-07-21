// ============================================
// AFT NexGen Cloud — Input Validation
// ============================================

/**
 * Validate a 13-digit Thai National ID Number.
 * Uses the standard Thai ID checksum algorithm.
 */
export function validateThaiNationalId(id: string): boolean {
  if (!/^\d{13}$/.test(id)) return false;

  const digits = id.split("").map(Number);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * (13 - i);
  }
  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === digits[12];
}

/**
 * Validate a Student ID (basic length check).
 * Thai vocational student IDs are typically 11 digits.
 */
export function validateStudentId(id: string): boolean {
  return /^\d{11}$/.test(id);
}

/**
 * Sanitize a string for display — trim and limit length.
 */
export function sanitizeDisplay(input: string, maxLength: number = 200): string {
  return input.trim().slice(0, maxLength);
}