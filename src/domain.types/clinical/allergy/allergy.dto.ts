import { Severity } from "../../miscellaneous/system.types";
import { AllergenCategories, AllergenExposureRoutes } from "./allergy.types";

export interface AllergyDto {
    id?                   : string;
    PatientUserId?        : string;
    Allergy               : string;
    AllergenCategory?     : AllergenCategories;
    AllergenExposureRoute?: AllergenExposureRoutes;
    Severity?             : Severity;
    Reaction?             : string;
    OtherInformation?     : string;
    LastOccurrence?       : Date;
}
