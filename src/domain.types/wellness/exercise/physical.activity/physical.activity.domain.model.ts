import { PhysicalActivityCategories, Intensity } from './physical.activity.types';

export interface PhysicalActivityDomainModel {
    id?: string;
    EhrId?: string;
    PatientUserId?: string;
    Exercise?: string;
    Description?: string;
    Category?: PhysicalActivityCategories;
    CaloriesBurned?: number;
    Intensity?: Intensity;
    ImageResourceId?: string;
    StartTime?: Date;
    EndTime?: Date;
    DurationInMin?: number;
}
