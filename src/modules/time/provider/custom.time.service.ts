import { ITimeService } from "../interfaces/time.service.interface";
import { DurationType } from "../interfaces/time.types";

export class CustomTimeService implements ITimeService {

    timestamp = (date: Date): string => {
        return date.getTime().toString();
    }

    addDuration = (date: Date, surationValue: number, durationType: DurationType): Date => {
        throw new Error("Method not implemented.");
    }

    subtractDuration = (date: Date, surationValue: number, durationType: DurationType): Date => {
        throw new Error("Method not implemented.");
    }

    isBefore = (first: Date, second: Date): boolean => {
        throw new Error("Method not implemented.");
    }

    isAfter = (first: Date, second: Date): boolean => {
        throw new Error("Method not implemented.");
    }

}
