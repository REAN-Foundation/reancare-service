export interface YearWiseUsers{
    Year?:number;
    UserCount?:number;
}

export interface YearWiseDeviceDetails{
    Year?:number;
    DeviceDetails?:any[];
}

export interface DailyStatisticsDto {
    id?                              : string;
    StatisticsReportedDate?          : Date;
    CronSchedulerTime?               :Date;
    StatisticsData?                  : object;
}
