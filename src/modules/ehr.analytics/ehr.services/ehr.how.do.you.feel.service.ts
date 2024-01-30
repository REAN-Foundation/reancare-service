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
        appNames?: string) => {

        if ((model.Feeling).toString() === '1') {
            EHRAnalyticsHandler.addSymptomRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.Symptom,
                null,
                null,
                null,
                'How are you feeling today?',
                'Better',
                null,
                appNames,
                model.RecordDate ? model.RecordDate : null
            );
        }

        if ((model.Feeling).toString() === '0') {
            EHRAnalyticsHandler.addSymptomRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.Symptom,
                null,
                null,
                null,
                'How are you feeling today?',
                'Same',
                null,
                appNames,
                model.RecordDate ? model.RecordDate : null
            );
        }

        if ((model.Feeling).toString() === '-1') {
            EHRAnalyticsHandler.addSymptomRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.Symptom,
                null,
                null,
                null,
                'How are you feeling today?',
                'Worse',
                null,
                appNames,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    public async addEHRHowDoYouFeelForAppNames(r: HowDoYouFeelDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordHowDoYouFeel(r, JSON.stringify(appNames));
    }

    public addEHRRecordDailyAssessment = async ( model: DailyAssessmentDto, appNames?: string) => {
        if (model.Mood) {
            EHRAnalyticsHandler.addSymptomRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.SymptomMood,
                model.Mood,
                null,
                null,
                null,
                null,
                null,
                appNames,
                model.RecordDate ? model.RecordDate : null
            );
        }

        if (model.Feeling) {
            EHRAnalyticsHandler.addSymptomRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.SymptomFeeling,
                null,
                model.Feeling,
                null,
                null,
                null,
                null,
                appNames,
                model.RecordDate ? model.RecordDate : null
            );
        }

        if (model.EnergyLevels.length > 0) {
            for await (var e of model.EnergyLevels) {
                EHRAnalyticsHandler.addSymptomRecord(
                    model.PatientUserId,
                    model.id,
                    null,
                    EHRRecordTypes.SymptomEnergyLevels,
                    null,
                    null,
                    e,
                    null,
                    null,
                    null,
                    appNames,
                    model.RecordDate ? model.RecordDate : null

                );
            }
        }
    };

    public async addEHRDailyAssessmentForAppNames(r: DailyAssessmentDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordDailyAssessment(r, JSON.stringify(appNames));
    }

}
