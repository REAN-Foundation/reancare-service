export interface PostnatalVisitDomainModel {
    id?               : string;
    DeliveryId       : string;
    PatientUserId     : string;
    DateOfVisit       : Date;
    BodyWeightId?     : string;
    ComplicationId?   : string;
    BodyTemperatureId?: string;
    BloodPressureId?  : string;
}
