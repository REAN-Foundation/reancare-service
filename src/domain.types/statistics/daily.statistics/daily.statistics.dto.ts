export interface YearWiseUsers {
    Year?       : number;
    UserCount?  : number;
}

export interface YearWiseDeviceDetails {
    Year?           : number;
    DeviceDetails?  : any[];
}

export interface DailyStatisticsDto {
    id?                              : string;
    ResourceId?                      : string;
    ReportDate?                      : string;
    ReportTimestamp?                 : Date;
    DashboardStats?                  : string;
    UserStats?                       : string;
    AhaStats?                        : string;
}
