import { injectable } from "tsyringe";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { PatientAppNameCache } from "../patient.appname.cache";
import { EHRRecordTypes } from "../ehr.domain.models/ehr.record.types";
import { HowDoYouFeelDto } from "../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.dto";
import { DailyAssessmentDto } from "../../../domain.types/clinical/daily.assessment/daily.assessment.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRHowDoYouFeelService {

    public addEHRRecordHowDoYouFeel = (
        model: HowDoYouFeelDto,
        appName?: string) => {

        if (model.Feeling == '1') {
            EHRAnalyticsHandler.addStringRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.Symptom,
                'Better',
                null,
                'How are you feeling today?',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }

        if (model.Feeling == '0') {
            EHRAnalyticsHandler.addStringRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.Symptom,
                'Same',
                null,
                'How are you feeling today?',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }

        if (model.Feeling == '-1') {
            EHRAnalyticsHandler.addStringRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.Symptom,
                'Worse',
                null,
                'How are you feeling today?',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    public async addEHRHowDoYouFeelForAppNames(r: HowDoYouFeelDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordHowDoYouFeel(r, null);
        }
    }

    public addEHRRecordDailyAssessment = async ( model: DailyAssessmentDto, appName?: string) => {
        if (model.Mood) {
            EHRAnalyticsHandler.addStringRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.Symptom,
                model.Mood,
                null,
                'How is your mood today?',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }

        if (model.Feeling) {
            EHRAnalyticsHandler.addStringRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.Symptom,
                model.Feeling,
                null,
                'How are you feeling today?',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }

        if (model.EnergyLevels.length > 0) {
            for await (var e of model.EnergyLevels) {
                EHRAnalyticsHandler.addStringRecord(
                    model.PatientUserId,
                    model.id,
                    null,
                    EHRRecordTypes.Symptom,
                    e,
                    null,
                    'How is your energy level today?',
                    null,
                    appName,
                    model.RecordDate ? model.RecordDate : null

                );
            }
        }
    };

    public async addEHRDailyAssessmentForAppNames(r: DailyAssessmentDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordDailyAssessment(r, null);
        }
    }

}
