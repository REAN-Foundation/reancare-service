import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { ISleepRepo } from "../../../database/repository.interfaces/wellness/daily.records/sleep.repo.interface";
import { SleepDomainModel } from '../../../domain.types/wellness/daily.records/sleep/sleep.domain.model';
import { SleepDto } from '../../../domain.types/wellness/daily.records/sleep/sleep.dto';
import { SleepSearchFilters, SleepSearchResults } from '../../../domain.types/wellness/daily.records/sleep/sleep.search.types';
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";
import { EHRRecordTypes } from "../../../modules/ehr.analytics/ehr.record.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class SleepService {

    constructor(
        @inject('ISleepRepo') private _sleepRepo: ISleepRepo,
    ) {}

    create = async (sleepDomainModel: SleepDomainModel): Promise<SleepDto> => {
        return await this._sleepRepo.create(sleepDomainModel);
    };

    getById = async (id: uuid): Promise<SleepDto> => {
        return await this._sleepRepo.getById(id);
    };

    getByRecordDate = async (recordDate: Date, patientUserId: uuid): Promise<SleepDto> => {
        return await this._sleepRepo.getByRecordDate(recordDate, patientUserId);
    };

    search = async (filters: SleepSearchFilters): Promise<SleepSearchResults> => {
        return await this._sleepRepo.search(filters);
    };

    update = async (id: uuid, sleepDomainModel: SleepDomainModel): Promise<SleepDto> => {
        return await this._sleepRepo.update(id, sleepDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._sleepRepo.delete(id);
    };

    getAllUserResponsesBetween = async (patientUserId: string, dateFrom: Date, dateTo: Date)
        : Promise<any[]> => {
        return await this._sleepRepo.getAllUserResponsesBetween(patientUserId, dateFrom, dateTo);
    };

    getAllUserResponsesBefore = async (patientUserId: string, date: Date)
        : Promise<any[]> => {
        return await this._sleepRepo.getAllUserResponsesBefore(patientUserId, date);
    };

    public addEHRRecord = (patientUserId: uuid, recordId: uuid, provider: string, model: SleepDomainModel, appName?: string) => {
        if (model.SleepDuration) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.MentalWellBeing,
                model.SleepDuration,
                model.Unit,
                'Sleep',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

}
