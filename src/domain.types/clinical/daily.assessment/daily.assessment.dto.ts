import { DailyAssessmentEnergyLevels, DailyAssessmentFeelings, DailyAssessmentMoods } from "./daily.assessment.types";

export interface DailyAssessmentDto {
    id?           : string,
    EhrId?        : string;
    PatientUserId?: string;
    Feeling?      : DailyAssessmentFeelings;
    Mood?         : DailyAssessmentMoods;
    EnergyLevels? : DailyAssessmentEnergyLevels[];
    RecordDate?   : Date;
}
