import { PhysicalActivityCategories, Intensity } from './physical.activity.types';
import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface PhysicalActivityDomainModel {
    id?                          : uuid;
    EhrId?                       : uuid;
    PatientUserId?               : uuid;
    Exercise?                    : string;
    Description?                 : string;
    Category?                    : PhysicalActivityCategories;
    CaloriesBurned?              : number;
    Intensity?                   : Intensity;
    ImageResourceId?             : uuid;
    StartTime?                   : Date;
    EndTime?                     : Date;
    TerraSummaryId?              : string;
    Provider?                    : string;
    DurationInMin?               : number;
    PhysicalActivityQuestion?    : string;
    PhysicalActivityQuestionAns? : boolean;
}
