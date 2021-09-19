import { DurationType } from "./time.types";

///////////////////////////////////////////////////////////////////////////////////////

export interface ITimeService {

    timestamp(date: Date): string;

    addDuration(date: Date, surationValue: number, durationType: DurationType): Date;

    subtractDuration(date: Date, surationValue: number, durationType: DurationType): Date;

    isBefore(first: Date, second: Date): boolean;

    isAfter(first: Date, second: Date): boolean;

}
