import { uuid } from "../../miscellaneous/system.types";

export interface FoodComponentDomainModel {
    id?          : uuid,
    EhrId?       : string;
    PatientUserId: uuid;
    TypeOfFood   : string;
    Amount       : number;
    Unit?        : string;
}
