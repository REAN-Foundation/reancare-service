export interface PostnatalVisitDto {
    id?                : string;
    DeliveryId         : string;
    PatientUserId      : string;
    DateOfVisit        : Date;
    BodyWeightId?      : string;
    ComplicationId?    : string;
    BodyTemperatureId? : string;
    BloodPressureId?   : string;
}
