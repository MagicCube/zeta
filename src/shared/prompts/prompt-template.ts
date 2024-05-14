export function applyPromptTemplate(
  template: string,
  variables: Record<string, string | number | boolean | Date | null | undefined>
) {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  return result;
}
