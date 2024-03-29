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
                model.PatientUserId,
                model.id,
                null,
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
                model.PatientUserId,
                model.id,
                null,
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

    public async addEHRHowDoYouFeelForAppNames(r: HowDoYouFeelDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        for (var appName of eligibleAppNames) {
            this.addEHRRecordHowDoYouFeel(r, appName);
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
                'Mood',
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
                'Feeling',
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
                    'EnergyLevels',
                    null,
                    appName,
                    model.RecordDate ? model.RecordDate : null

                );
            }
        }
    };

    public async addEHRDailyAssessmentForAppNames(r: DailyAssessmentDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        for (var appName of eligibleAppNames) {
            this.addEHRRecordDailyAssessment(r, appName);
        }
    }

}
