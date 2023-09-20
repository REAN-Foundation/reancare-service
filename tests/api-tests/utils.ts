import { faker } from "@faker-js/faker";
import { setTestData } from "./init";

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

const date = new Date();

const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();

const randomDays = faker.number.int({ min: 1, max: 365 });
const futureDate = new Date(year, month, day + randomDays);

const formattedMonth = month < 10 ? `0${month}` : month;
const formattedDay = day < 10 ? `0${day}` : day;

const futureYear = futureDate.getFullYear();

export const futureDateString = `${futureYear}-${formattedMonth}-${formattedDay}`;

const pastDate = new Date(year, month, day - randomDays);

const pastYear = pastDate.getFullYear();

export const pastDateString = `${pastYear}-${formattedMonth}-${formattedDay}`;

//Timezone
export const startDate = new Date(date.getTime() + (60 * 60 * 24 * 14) * 1000);
export const endDate = new Date(date.getTime() + (160 * 160 * 24 * 14) * 1000);