export interface BabyDto {
    id?                 : string;
    DeliveryId          : string;
    PatientUserId?      : string;
    WeightAtBirthGrams  : number;
    Gender              : string;
    Status              : string;
    ComplicationId?     : string;
}
