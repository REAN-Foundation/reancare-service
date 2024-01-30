import { injectable } from "tsyringe";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { SleepDto } from "../../../domain.types/wellness/daily.records/sleep/sleep.dto";
import { EHRRecordTypes } from "../ehr.domain.models/ehr.record.types";
import { MeditationDto } from "../../../domain.types/wellness/exercise/meditation/meditation.dto";
import { PatientAppNameCache } from "../patient.appname.cache";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRMentalWellBeingService {

    public addEHRRecordSleep = async (model: SleepDto, appNames?: string) => {
        if (model.SleepDuration) {
            EHRAnalyticsHandler.addMentalWellbeingRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.MentalWellBeingSleep,
                model.SleepDuration,
                null,
                model.Unit,
                appNames,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    public addEHRRecordMeditation = async (model: MeditationDto, appNames?: string) => {
        if (model.DurationInMins) {
            EHRAnalyticsHandler.addMentalWellbeingRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.MentalWellBeingMeditation,
                null,
                model.DurationInMins,
                'mins',
                appNames,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
    };

    public async addEHRSleepForAppNames(r: SleepDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordSleep(r, JSON.stringify(appNames));
    }

    public async addEHRMeditationForAppNames(r: MeditationDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordMeditation(r, JSON.stringify(appNames));
    }

}
