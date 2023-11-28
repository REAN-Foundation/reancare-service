import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";
import { EHRRecordTypes } from "../../../modules/ehr.analytics/ehr.record.types";
import { inject, injectable } from "tsyringe";
import { IDailyAssessmentRepo } from "../../../database/repository.interfaces/clinical/daily.assessment/daily.assessment.repo.interface";
import { DailyAssessmentDomainModel } from '../../../domain.types/clinical/daily.assessment/daily.assessment.domain.model';
import { DailyAssessmentDto } from '../../../domain.types/clinical/daily.assessment/daily.assessment.dto';
import { DailyAssessmentSearchFilters, DailyAssessmentSearchResults } from '../../../domain.types/clinical/daily.assessment/daily.assessment.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DailyAssessmentService {

    constructor(
        @inject('IDailyAssessmentRepo') private _dailyAssessmentRepo: IDailyAssessmentRepo,
    ) {}

    create = async (dailyAssessmentDomainModel: DailyAssessmentDomainModel): Promise<DailyAssessmentDto> => {
        return await this._dailyAssessmentRepo.create(dailyAssessmentDomainModel);
    };

    search = async (filters: DailyAssessmentSearchFilters): Promise<DailyAssessmentSearchResults> => {
        return await this._dailyAssessmentRepo.search(filters);
    };

    public addEHRRecord = async (patientUserId: uuid, recordId: uuid, provider: string, model: DailyAssessmentDomainModel, appName?: string) => {
        if (model.Mood) {
            EHRAnalyticsHandler.addStringRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.Symptom,
                model.Mood,
                null,
                'Mood',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }

        if (model.Feeling) {
            EHRAnalyticsHandler.addStringRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.Symptom,
                model.Feeling,
                null,
                'Feeling',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }

        if (model.EnergyLevels.length > 0) {
            for await (var e of model.EnergyLevels) {
                EHRAnalyticsHandler.addStringRecord(
                    patientUserId,
                    recordId,
                    provider,
                    EHRRecordTypes.Symptom,
                    e,
                    null,
                    'EnergyLevels',
                    null,
                    appName,
                    model.RecordDate ? model.RecordDate : null
    
                );

            }
        }
    };

}
