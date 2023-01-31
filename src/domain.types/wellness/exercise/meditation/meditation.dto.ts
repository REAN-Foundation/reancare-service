
export interface MeditationDto {
    id?             : string,
    EhrId?          : string;
    PatientUserId   : string;
    Meditation?      : string;
    Description?    : string;
    Category?       : string;
    DurationInMins? : number;
    StartTime       : Date;
    EndTime?        : Date;
}

export interface MeditationForDayDto {
    PatientUserId?: string;
    Date          : Date;
    Meditations   : MeditationDto[];
}
