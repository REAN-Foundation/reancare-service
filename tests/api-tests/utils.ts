export function getRandomEnumValue<T>(en: T) {
  const values = Object.values(en as object);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

export enum repeatListdata {
  'First-Wednesday',
  'Last-Friday',
  'Second-Saturday'
}

export const whenTime = new Date();