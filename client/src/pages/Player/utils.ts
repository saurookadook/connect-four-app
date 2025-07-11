function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

type FormDataMapValue = {
  invalidReason?: string;
  isValid: boolean;
  value: string;
};
type FormDataMap = Record<string, FormDataMapValue>;

export function getFormData(formEl: HTMLFormElement): FormDataMap {
  const data: FormDataMap = {};

  for (const inputEl of formEl) {
    if (inputEl instanceof HTMLButtonElement) {
      continue;
    }

    if (inputEl instanceof HTMLInputElement) {
      const key = toCamelCase(inputEl.name);
      const value = inputEl.value.trim();
      data[key] = {
        invalidReason: inputEl.validationMessage,
        isValid: inputEl.validity.valid,
        value,
      };
    }
  }

  return data;
}
