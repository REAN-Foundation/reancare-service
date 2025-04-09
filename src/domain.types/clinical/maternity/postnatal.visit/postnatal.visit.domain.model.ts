import { DeliveryDomainModel } from "../delivery/delivery.domain.model";

export interface PostnatalVisitDomainModel {
    id?                 : string;
    DeliveryId          : string;
    PatientUserId       : string;
    DateOfVisit         : Date;
    BodyWeightId?       : string;
    ComplicationId?     : string;
    BodyTemperatureId?  : string;
    BloodPressureId?    : string;
    Delivery?             : DeliveryDomainModel;
}
