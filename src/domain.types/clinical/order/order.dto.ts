import { PatientDto } from "../../users/patient/patient/patient.dto";
import { PersonDto } from "../../person/person.dto";
import { OrderStates, OrderTypes } from "./order.types";

export interface OrderDto {
    id?                       : string,
    Type?                     : OrderTypes;
    EhrId?                    : string;
    DisplayId?                : string;
    PatientUserId?            : string;
    Patient?                  : PatientDto;
    MedicalPractitionerUserId?: string;
    MedicalPractitioner?      : PersonDto;
    VisitId?                  : string;
    ResourceId?               : string;
    ReferenceOrderId?         : string;
    ReferenceOrder?           : OrderDto;
    CurrentState?             : OrderStates;
    OrderDate?                : Date;
    FulfilledByUserId?        : string;
    FulfilledByOrganizationId?: string;
    AdditionalInformation?    : string;
}
