export function usePhoneMask() {
  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 11);
    const match = limitedDigits.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);

    if (!match) return value;

    const [, countryCode, areaCode, firstPart, secondPart, thirdPart] = match;

    let result = '';

    if (countryCode) {
      result = `+${countryCode}`;
    }

    if (areaCode) {
      result += ` (${areaCode}`;
      if (areaCode.length === 3) {
        result += ')';
      }
    }

    if (firstPart) {
      result += ` ${firstPart}`;
    }

    if (secondPart) {
      result += `-${secondPart}`;
    }

    if (thirdPart) {
      result += `-${thirdPart}`;
    }

    return result;
  };

  let isUpdating = false;

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;

    if (isUpdating) {
      return;
    }

    const start = input.selectionStart || 0;
    const oldValue = input.value;
    const oldLength = oldValue.length;

    const formatted = formatPhone(oldValue);

    if (formatted !== oldValue) {
      isUpdating = true;
      input.value = formatted;

      const newLength = formatted.length;
      const lengthDiff = newLength - oldLength;

      let newPosition = start + lengthDiff;

      const formatChars = [' ', '(', ')', '-'];
      if (lengthDiff > 0 && formatChars.includes(formatted[newPosition - 1])) {
        newPosition++;
      }

      input.setSelectionRange(newPosition, newPosition);

      input.dispatchEvent(new Event('input', { bubbles: true }));

      isUpdating = false;
    }
  };

  const cleanPhone = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  const isValidPhone = (value: string): boolean => {
    if (!value) return false;
    const digits = cleanPhone(value);
    return digits.length === 11 && digits.startsWith('7');
  };

  return {
    formatPhone,
    handleInput,
    cleanPhone,
    isValidPhone,
  };
}
