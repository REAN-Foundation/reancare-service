import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IMeditationRepo } from "../../../database/repository.interfaces/wellness/exercise/meditation.repo.interface";
import { MeditationDomainModel } from '../../../domain.types/wellness/exercise/meditation/meditation.domain.model';
import { MeditationDto } from '../../../domain.types/wellness/exercise/meditation/meditation.dto';
import { MeditationSearchResults, MeditationSearchFilters } from '../../../domain.types/wellness/exercise/meditation/meditation.search.types';
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";
import { EHRRecordTypes } from "../../../modules/ehr.analytics/ehr.domain.models/ehr.record.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class MeditationService {

    constructor(
        @inject('IMeditationRepo') private _meditationRepo: IMeditationRepo,
    ) { }

    create = async (meditationDomainModel: MeditationDomainModel):
    Promise<MeditationDto> => {
        return await this._meditationRepo.create(meditationDomainModel);
    };

    getById = async (id: uuid): Promise<MeditationDto> => {
        return await this._meditationRepo.getById(id);
    };

    search = async (filters: MeditationSearchFilters): Promise<MeditationSearchResults> => {
        return await this._meditationRepo.search(filters);
    };

    update = async (id: uuid, meditationDomainModel: MeditationDomainModel):
    Promise<MeditationDto> => {
        return await this._meditationRepo.update(id, meditationDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._meditationRepo.delete(id);
    };

    getAllUserResponsesBetween = async (patientUserId: string, dateFrom: Date, dateTo: Date)
        : Promise<any[]> => {
        return await this._meditationRepo.getAllUserResponsesBetween(patientUserId, dateFrom, dateTo);
    };

    getAllUserResponsesBefore = async (patientUserId: string, date: Date)
        : Promise<any[]> => {
        return await this._meditationRepo.getAllUserResponsesBefore(patientUserId, date);
    };

}
