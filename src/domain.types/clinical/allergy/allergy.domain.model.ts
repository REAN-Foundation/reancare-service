import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { Severity } from "../../miscellaneous/system.types";
import { AllergenCategories, AllergenExposureRoutes } from "./allergy.types";

export interface AllergyDomainModel {
    id?                   : uuid;
    PatientUserId?        : uuid;
    Allergy               : string;
    AllergenCategory?     : AllergenCategories;
    AllergenExposureRoute?: AllergenExposureRoutes;
    Severity?             : Severity;
    Reaction?             : string;
    OtherInformation?     : string;
    LastOccurrence?       : Date;
}
