import { uuid } from "../../../../domain.types/miscellaneous/system.types";
export interface SymptomTypeDomainModel {
    id?             : uuid,
    EhrId?          : uuid;
    Symptom?        : string;
    Description?    : string;
    Tags?           : string[];
    PostDate?       : Date;
    Language?       : string;
    ImageResourceId?: uuid;
}
