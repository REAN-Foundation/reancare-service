
export interface SymptomTypeDomainModel {
    id?             : string,
    EhrId?          : string;
    Symptom?        : string;
    Description?    : string;
    Tags?           : string[];
    Language?       : string;
    ImageResourceId?: string;
}
