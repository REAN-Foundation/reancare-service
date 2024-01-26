export interface DailySystemStatisticsDomainModel {
    id?                              : string;
    ResourceId?                      : string;
    ReportDate?                      : string;
    ReportTimestamp?                 : Date;
    DashboardStats?                  : string;
    UserStats?                       : string;
    AHAStats?                        : string;
}

export interface DailyTenantStatisticsDomainModel {
    id?                              : string;
    TenantId?                        : string;
    ReportDate?                      : string;
    ReportTimestamp?                 : Date;
    DashboardStats?                  : string;
    UserStats?                       : string;
}
