import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";
import { EHRRecordTypes } from "../../../modules/ehr.analytics/ehr.record.types";
import { inject, injectable } from "tsyringe";
import { IPhysicalActivityRepo } from "../../../database/repository.interfaces/wellness/exercise/physical.activity.repo.interface";
import { PhysicalActivityDomainModel } from '../../../domain.types/wellness/exercise/physical.activity/physical.activity.domain.model';
import { PhysicalActivityDto } from '../../../domain.types/wellness/exercise/physical.activity/physical.activity.dto';
import { PhysicalActivitySearchFilters, PhysicalActivitySearchResults } from '../../../domain.types/wellness/exercise/physical.activity/physical.activity.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PhysicalActivityService {

    constructor(
        @inject('IPhysicalActivityRepo') private _physicalActivityRepo: IPhysicalActivityRepo,
    ) {}

    create = async (physicalActivityDomainModel: PhysicalActivityDomainModel): Promise<PhysicalActivityDto> => {
        return await this._physicalActivityRepo.create(physicalActivityDomainModel);
    };

    getById = async (id: string): Promise<PhysicalActivityDto> => {
        return await this._physicalActivityRepo.getById(id);
    };

    search = async (filters: PhysicalActivitySearchFilters): Promise<PhysicalActivitySearchResults> => {
        return await this._physicalActivityRepo.search(filters);
    };

    // eslint-disable-next-line max-len
    update = async (id: string, physicalActivityDomainModel: PhysicalActivityDomainModel): Promise<PhysicalActivityDto> => {
        return await this._physicalActivityRepo.update(id, physicalActivityDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._physicalActivityRepo.delete(id);
    };

    getAllUserResponsesBetween = async (patientUserId: string, dateFrom: Date, dateTo: Date)
        : Promise<any[]> => {
        return await this._physicalActivityRepo.getAllUserResponsesBetween(patientUserId, dateFrom, dateTo);
    };

    getAllUserResponsesBefore = async (patientUserId: string, date: Date)
        : Promise<any[]> => {
        return await this._physicalActivityRepo.getAllUserResponsesBefore(patientUserId, date);
    };

    public addEHRRecord = (patientUserId: uuid, recordId: uuid, provider: string, model: PhysicalActivityDto, appName?: string) => {
        if (model.PhysicalActivityQuestionAns !== null) {
            EHRAnalyticsHandler.addBooleanRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.PhysicalActivity,
                model.PhysicalActivityQuestionAns,
                null,
                null,
                'Did you add movement to your day today?',
                appName,
                model.CreatedAt ? model.CreatedAt : null
            );
        }

        if (model.DurationInMin) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.PhysicalActivity,
                model.DurationInMin,
                'mins',   
                model.Category,
                'Exercise',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }

    };


}
