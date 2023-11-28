import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";
import { EHRRecordTypes } from "../../../modules/ehr.analytics/ehr.record.types";
import { inject, injectable } from "tsyringe";
import { IStepCountRepo } from "../../../database/repository.interfaces/wellness/daily.records/step.count.interface";
import { StepCountDomainModel } from '../../../domain.types/wellness/daily.records/step.count/step.count.domain.model';
import { StepCountDto } from '../../../domain.types/wellness/daily.records/step.count/step.count.dto';
import { StepCountSearchFilters, StepCountSearchResults } from '../../../domain.types/wellness/daily.records/step.count/step.count.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class StepCountService {

    constructor(
        @inject('IStepCountRepo') private _stepCountRepo: IStepCountRepo,
    ) {}

    create = async (stepCountDomainModel: StepCountDomainModel): Promise<StepCountDto> => {
        return await this._stepCountRepo.create(stepCountDomainModel);
    };

    getById = async (id: string): Promise<StepCountDto> => {
        return await this._stepCountRepo.getById(id);
    };

    getByRecordDate = async (recordDate: Date): Promise<StepCountDto> => {
        return await this._stepCountRepo.getByRecordDate(recordDate);
    };

    getByRecordDateAndPatientUserId = async (recordDate: Date, patientUserId : string, provider: string):
        Promise<StepCountDto> => {
        return await this._stepCountRepo.getByRecordDateAndPatientUserId(recordDate, patientUserId, provider);
    };

    search = async (filters: StepCountSearchFilters): Promise<StepCountSearchResults> => {
        return await this._stepCountRepo.search(filters);
    };

    update = async (id: string, stepCountDomainModel: StepCountDomainModel): Promise<StepCountDto> => {
        return await this._stepCountRepo.update(id, stepCountDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._stepCountRepo.delete(id);
    };

    public addEHRRecord = (patientUserId: uuid, recordId: uuid, provider: string, model: StepCountDomainModel, appName?: string) => {
        if (model.StepCount) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.PhysicalActivity,
                model.StepCount,
                model.Unit,
                'Step-count',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

}
