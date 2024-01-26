export interface YearWiseUsers {
    Year?       : number;
    UserCount?  : number;
}

export interface YearWiseDeviceDetails {
    Year?           : number;
    DeviceDetails?  : any[];
}

export interface YearWiseAgeDetails {
    Year?           : number;
    AgeDetails?  : any[];
}

export interface YearWiseGenderDetails {
    Year?           : number;
    GenderDetails?  : any[];
}

export interface YearWiseMaritalDetails {
    Year?           : number;
    MaritalDetails?  : any[];
}

export interface YearWiseCountryDetails {
    Year?           : number;
    CountryDetails?  : any[];
}

export interface YearWiseMajorAilmentDistributionDetails {
    Year?           : number;
    MajorAilmentDistributionDetails?  : any[];
}

export interface YearWiseAddictionDistributionDetails {
    Year?           : number;
    AddictionDistributionDetails?  : any[];
}

export interface DailySystemStatisticsDto {
    id?                              : string;
    ResourceId?                      : string;
    ReportDate?                      : string;
    ReportTimestamp?                 : Date;
    DashboardStats?                  : string;
    UserStats?                       : string;
    AHAStats?                        : string;
}

export interface DailyTenantStatisticsDto {
    id?                              : string;
    TenantId?                        : string;
    ReportDate?                      : string;
    ReportTimestamp?                 : Date;
    DashboardStats?                  : string;
    UserStats?                       : string;
}
