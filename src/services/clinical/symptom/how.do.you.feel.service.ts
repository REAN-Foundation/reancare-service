import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IHowDoYouFeelRepo } from "../../../database/repository.interfaces/clinical/symptom/how.do.you.feel.repo.interface";
import { HowDoYouFeelDomainModel } from '../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.domain.model';
import { HowDoYouFeelDto } from '../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.dto';
import { HowDoYouFeelSearchFilters, HowDoYouFeelSearchResults } from '../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.search.types';
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";
import { EHRRecordTypes } from "../../../modules/ehr.analytics/ehr.record.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HowDoYouFeelService {

    constructor(
        @inject('IHowDoYouFeelRepo') private _howDoYouFeelRepo: IHowDoYouFeelRepo,
    ) {}

    create = async (howDoYouFeelDomainModel: HowDoYouFeelDomainModel): Promise<HowDoYouFeelDto> => {
        return await this._howDoYouFeelRepo.create(howDoYouFeelDomainModel);
    };

    getById = async (id: uuid): Promise<HowDoYouFeelDto> => {
        return await this._howDoYouFeelRepo.getById(id);
    };

    search = async (filters: HowDoYouFeelSearchFilters): Promise<HowDoYouFeelSearchResults> => {
        return await this._howDoYouFeelRepo.search(filters);
    };

    update = async (id: uuid, howDoYouFeelDomainModel: HowDoYouFeelDomainModel): Promise<HowDoYouFeelDto> => {
        return await this._howDoYouFeelRepo.update(id, howDoYouFeelDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._howDoYouFeelRepo.delete(id);
    };

    public addEHRRecord = (patientUserId: uuid, recordId: uuid, provider: string, model: HowDoYouFeelDomainModel, appName?: string) => {
        if (model.Feeling == '1') {
            EHRAnalyticsHandler.addStringRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.Symptom,
                model.Feeling,
                null,
                'Better',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }

        if (model.Feeling == '0') {
            EHRAnalyticsHandler.addStringRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.Symptom,
                model.Feeling,
                null,
                'Same',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }

        if (model.Feeling == '-1') {
            EHRAnalyticsHandler.addStringRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.Symptom,
                model.Feeling,
                null,
                'Worse',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null

            );
        }
    };

}
