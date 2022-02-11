import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface DrugDomainModel {
    id?                  : uuid,
    EhrId?               : string;
    DrugName?            : string;
    GenericName?         : string;
    Ingredients?         : string;
    Strength?            : string;
    OtherCommercialNames?: string;
    Manufacturer?        : string;
    OtherInformation?    : string;
}
