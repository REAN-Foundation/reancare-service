
export interface SymptomTypeDto {
    id?             : string,
    EhrId?          : string;
    Symptom?        : string;
    Description?    : string;
    Tags?           : string[];
    Language?       : string;
    ImageResourceId?: string;
    CreatedAt?      : Date;
}
