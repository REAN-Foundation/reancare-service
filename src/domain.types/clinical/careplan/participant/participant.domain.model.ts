export interface ParticipantDomainModel {
    id?            : string;
    Provider       : string;
    Name           : string;
    PatientUserId  : string;
    Gender?        : string;
    Phone?         : string;
    Email?         : string;
    IsActive?      : boolean;
    Age?           : number;
    Dob?           : Date;
    HeightInInches?: number;
    WeightInLbs?   : number;
    MaritalStatus? : string;
    ZipCode?       : number;
}
