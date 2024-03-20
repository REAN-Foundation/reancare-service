
export interface LocationDomainModel {
    id?              : string;
    PatientUserId    : string;
    City?            : string;  
    Longitude?       : number;
    Lattitude?       : number;
    CurrentTimezone? : string;
    IsActive ?       : boolean;
}
