
import { PhysicalActivityCategories, Intensity } from './physical.activity.types';

export interface PhysicalActivityDto {
    id?                          : string;
    EhrId?                       : string;
    PatientUserId?               : string;
    Exercise                     : string;
    Description?                 : string;
    Category?                    : PhysicalActivityCategories;
    CaloriesBurned?              : number;
    Intensity?                   : Intensity;
    ImageResourceId?             : string;
    StartTime?                   : Date;
    EndTime?                     : Date;
    TerraSummaryId?              : string;
    Provider?                    : string;
    DurationInMin?               : number;
    PhysicalActivityQuestion?    : string;
    PhysicalActivityQuestionAns? : boolean;
    CreatedAt?                   : Date;
    UpdatedAt?                   : Date;
}

export interface PhysicalActivityForDayDto {
    PatientUserId?     : string;
    Date               : Date;
    Exercises          : PhysicalActivityDto[];
    TotalCaloriesBurned: number;
    StartTime?         : Date;
    EndTime?           : Date;
    DurationInMin?     : number;
}
