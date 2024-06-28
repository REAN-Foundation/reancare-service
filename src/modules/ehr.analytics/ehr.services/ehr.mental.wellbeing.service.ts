import { injectable } from "tsyringe";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { SleepDto } from "../../../domain.types/wellness/daily.records/sleep/sleep.dto";
import { EHRRecordTypes } from "../ehr.domain.models/ehr.record.types";
import { MeditationDto } from "../../../domain.types/wellness/exercise/meditation/meditation.dto";
import { PatientAppNameCache } from "../patient.appname.cache";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRMentalWellBeingService {

    public addEHRRecordSleep = async (model: SleepDto, appName?: string) => {
        if (model.SleepDuration) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.MentalWellBeing,
                model.SleepDuration,
                model.Unit,
                'Sleep',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
        if (model.SleepMinutes) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.MentalWellBeing,
                model.SleepMinutes,
                model.Unit,
                'Sleep',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    public addEHRRecordMeditation = async (model: MeditationDto, appName?: string) => {
        if (model.DurationInMins) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.MentalWellBeing,
                model.DurationInMins,
                'mins',
                'Meditation',
                null,
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
    };

    public async addEHRSleepForAppNames(r: SleepDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordSleep(r, null);
        }
    }

    public async addEHRMeditationForAppNames(r: MeditationDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordMeditation(r, null);
        }
    }

}
