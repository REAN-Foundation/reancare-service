import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";
import { EHRRecordTypes } from "../../../modules/ehr.analytics/ehr.record.types";
import { inject, injectable } from "tsyringe";
import { IStandRepo } from "../../../database/repository.interfaces/wellness/daily.records/stand.repo.interface";
import { StandDomainModel } from '../../../domain.types/wellness/daily.records/stand/stand.domain.model';
import { StandDto } from '../../../domain.types/wellness/daily.records/stand/stand.dto';
import { StandSearchFilters, StandSearchResults } from '../../../domain.types/wellness/daily.records/stand/stand.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class StandService {

    constructor(
        @inject('IStandRepo') private _standRepo: IStandRepo,
    ) {}

    create = async (standDomainModel: StandDomainModel): Promise<StandDto> => {
        return await this._standRepo.create(standDomainModel);
    };

    getById = async (id: string): Promise<StandDto> => {
        return await this._standRepo.getById(id);
    };

    search = async (filters: StandSearchFilters): Promise<StandSearchResults> => {
        return await this._standRepo.search(filters);
    };

    update = async (id: string, standDomainModel: StandDomainModel): Promise<StandDto> => {
        return await this._standRepo.update(id, standDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._standRepo.delete(id);
    };

    public addEHRRecord = (patientUserId: uuid, recordId: uuid, provider: string, model: StandDomainModel, appName?: string) => {
        if (model.Stand) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.PhysicalActivity,
                model.Stand,
                model.Unit,
                'Stand',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };


}
