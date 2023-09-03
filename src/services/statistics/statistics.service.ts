import { inject, injectable } from "tsyringe";
import { IStatisticsRepo } from "../../database/repository.interfaces/statistics/statistics.repo.interface";
import { AppDownloadDto } from "../../domain.types/statistics/app.download.dto";
import { AppDownloadDomainModel } from "../../domain.types/statistics/app.download.domain.model";
import { StatisticSearchFilters } from "../../domain.types/statistics/statistics.search.type";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class StatisticsService {

    constructor(
        @inject('IStatisticsRepo') private _statisticsRepo: IStatisticsRepo,
    ) {}

    getUsersCount = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersCount(filters);
    };

    getUsersStats = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersStats(filters);
    };
    
    getUsersByRole = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByRole(filters);
    };

    getUsersByGender = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByGender(filters);
    };

    getUsersByAge = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByAge(filters);
    };

    getUsersByMaritalStatus = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByMaritalStatus(filters);
    };

    getUsersByDeviceDetail = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByDeviceDetail(filters);
    };

    getUsersByEnrollment = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByEnrollment(filters);
    };

    updateAppDownloadCount = async (appDownloadDomainModel: AppDownloadDomainModel ): Promise<AppDownloadDto> => {
        return await this._statisticsRepo.updateAppDownloadCount(appDownloadDomainModel);
    };

    getAppDownlodCount = async (): Promise<any> => {
        return await this._statisticsRepo.getAppDownlodCount();
    };

    getUsersByCountry = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByCountry(filters);
    };

    getUsersByMajorAilment = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByMajorAilment(filters);
    };

    getUsersByObesity = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByObesity(filters);
    };
    
    getUsersByAddiction = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByAddiction(filters);
    };

    getUsersByHealthPillar = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByHealthPillar(filters);
    };

    getUsersByBiometrics = async (filters: StatisticSearchFilters): Promise<any> => {
        return await this._statisticsRepo.getUsersByBiometrics(filters);
    };
    
}
