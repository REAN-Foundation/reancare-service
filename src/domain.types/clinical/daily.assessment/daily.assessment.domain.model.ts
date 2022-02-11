import { uuid } from "../../miscellaneous/system.types";
import { DailyAssessmentEnergyLevels, DailyAssessmentFeelings, DailyAssessmentMoods } from "./daily.assessment.types";

export interface DailyAssessmentDomainModel {
    id?           : string,
    EhrId?        : string;
    PatientUserId?: uuid;
    Feeling?      : DailyAssessmentFeelings;
    Mood?         : DailyAssessmentMoods;
    EnergyLevels? : DailyAssessmentEnergyLevels[];
    RecordDate?   : Date;
}
