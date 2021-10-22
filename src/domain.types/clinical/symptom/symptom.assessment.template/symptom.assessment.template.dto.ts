
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
    Title?              : string;
    Description?        : string;
    Tags?               : string;
    TemplateSymptomTypes: TemplateSymptomTypesDto[];
}
