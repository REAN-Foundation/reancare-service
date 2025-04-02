export interface PregnancyDto {
    id?                         : string;
    PatientUserId?              : string;
    ExternalPregnancyId?        : string;
    DateOfLastMenstrualPeriod?  : Date;
    EstimatedDateOfChildBirth?  : Date;
    Gravidity?                  : number;
    Parity?                     : number;
}
