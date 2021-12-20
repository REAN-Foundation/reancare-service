export interface ParticipantDto {
    id?            : string;
    UserId         : string;
    ParticipantId  : string;
    Name           : string;
    Gender?        : string;
    IsActive?      : boolean;
    Age?           : number;
    Dob?           : Date;
    HeightInInches?: number;
    WeightInLbs?   : number;
    MaritalStatus? : string;
    ZipCode?       : number;
}
