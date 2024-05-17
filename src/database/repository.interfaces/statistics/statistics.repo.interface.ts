import { StatisticSearchFilters } from "../../../domain.types/statistics/statistics.search.type";
import { AppDownloadDomainModel } from "../../../domain.types/statistics/app.download.domain.model";
import { AppDownloadDto } from "../../../domain.types/statistics/app.download.dto";
import { DatabaseSchemaType } from "../../../common/database.utils/database.config";

////////////////////////////////////////////////////////////////////
export interface IStatisticsRepo {

    getUsersCount(filters: StatisticSearchFilters): Promise<any>;
    
    getUsersStats(filters: StatisticSearchFilters): Promise<any>;

    getUsersByRole(filters: StatisticSearchFilters): Promise<any>;

    getUsersByGender(filters: StatisticSearchFilters): Promise<any>;

    getUsersByAge(filters: StatisticSearchFilters): Promise<any>;

    getYearWiseAgeDetails(filter): Promise<any>;

    getUsersByMaritalStatus(filters: StatisticSearchFilters): Promise<any>;

    getUsersByDeviceDetail(filters: StatisticSearchFilters): Promise<any>;

    // getUsersByEnrollment(filters: StatisticSearchFilters): Promise<any>;

    updateAppDownloadCount(appDownloadDomainModel: AppDownloadDomainModel): Promise<AppDownloadDto>;

    getAppDownlodCount(): Promise<any>;

    getUsersByCountry(filters: StatisticSearchFilters): Promise<any>;

    getUsersByMajorAilment(filters: StatisticSearchFilters): Promise<any>;

    getUsersByObesity(filters: StatisticSearchFilters): Promise<any>;

    getUsersByAddiction(filters: StatisticSearchFilters): Promise<any>;

    getUsersByHealthPillar(filters: StatisticSearchFilters): Promise<any>;

    getUsersByBiometrics(filters: StatisticSearchFilters): Promise<any>;
    
    getAllYears(): Promise<any>;

    getYearWiseUserCount(filter): Promise<any>;

    getYearWiseDeviceDetails(filter, getYearWiseDeviceDetails): Promise<any>;

    getYearWiseGenderDetails(filter): Promise<any>;

    getYearWiseMaritalDetails(filter): Promise<any>;

    getYearWiseMajorAilmentDistributionDetails(filter): Promise<any>;

    getYearWiseAddictionDistributionDetails(filter, yearWiseUserCount): Promise<any>;

    createConnection(schemaType: DatabaseSchemaType): Promise<void>;

}
