export interface DailyStatisticsDomainModel {
    id?                              : string;
    ResourceId?                      : string;
    ReportDate?                      : string;
    ReportTimestamp?                 : Date;
    DashboardStats?                  : string;
    UserStats?                       : string;
    AhaStats?                        : string;
}
