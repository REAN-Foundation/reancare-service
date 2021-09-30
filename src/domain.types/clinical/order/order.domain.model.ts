import { OrderStates, OrderTypes } from "./order.types";

export interface OrderDomainModel {
    id?: string,
    Type?: OrderTypes;
    EhrId?: string;
    DisplayId?: string;
    PatientUserId?: string;
    MedicalPractitionerUserId?: string;
    VisitId?: string;
    ResourceId?: string;
    ReferenceOrderId?: string;
    CurrentState?: OrderStates;
    OrderDate?: Date;
    FulfilledByUserId?: string;
    FulfilledByOrganizationId?: string;
    AdditionalInformation?: string;
}
