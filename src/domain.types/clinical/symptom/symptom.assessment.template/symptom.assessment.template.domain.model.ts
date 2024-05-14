import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface SymptomAssessmentTemplateDomainModel {
    id?         : uuid,
    TenantId?   : uuid;
    Title?      : string;
    Description?: string;
    Tags?       : string[];
}
