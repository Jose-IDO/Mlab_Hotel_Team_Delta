export const generateId = (prefix: string = 'r'): string => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};