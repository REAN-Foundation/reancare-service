import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { OrderStates, OrderTypes } from "./order.types";

export interface OrderDomainModel {
    id?                       : uuid,
    Type?                     : OrderTypes;
    EhrId?                    : string;
    DisplayId?                : string;
    PatientUserId?            : uuid;
    MedicalPractitionerUserId?: uuid;
    VisitId?                  : uuid;
    ResourceId?               : uuid;
    ReferenceOrderId?         : uuid;
    CurrentState?             : OrderStates;
    OrderDate?                : Date;
    FulfilledByUserId?        : uuid;
    FulfilledByOrganizationId?: uuid;
    AdditionalInformation?    : string;
}
