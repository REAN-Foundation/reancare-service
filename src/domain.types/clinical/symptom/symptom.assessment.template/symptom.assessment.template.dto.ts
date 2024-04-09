import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface TemplateSymptomTypesDto {
    Index?          : number;
    SymptomTypeId?  : string;
    Symptom?        : string;
    Description?    : string;
    ImageResourceId?: string;
    Tags?           : string;
}

export interface SymptomAssessmentTemplateDto {
    id?                 : string,
    TenantId?           : uuid;
    Title?              : string;
    Description?        : string;
    Tags?               : string;
    TemplateSymptomTypes: TemplateSymptomTypesDto[];
}
