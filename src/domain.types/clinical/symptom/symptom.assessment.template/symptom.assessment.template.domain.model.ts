import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface SymptomAssessmentTemplateDomainModel {
    id?         : uuid,
    Title?      : string;
    Description?: string;
    Tags?       : string[];
}
