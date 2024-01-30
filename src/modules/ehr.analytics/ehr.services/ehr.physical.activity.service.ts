import { injectable } from "tsyringe";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { StandDto } from "../../../domain.types/wellness/daily.records/stand/stand.dto";
import { StepCountDto } from "../../../domain.types/wellness/daily.records/step.count/step.count.dto";
import { PhysicalActivityDto } from "../../../domain.types/wellness/exercise/physical.activity/physical.activity.dto";
import { PatientAppNameCache } from "../patient.appname.cache";
import { EHRRecordTypes } from "../ehr.domain.models/ehr.record.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRPhysicalActivityService {

    public addEHRRecordStand = (model: StandDto, appNames?: string) => {
        if (model.Stand) {
            EHRAnalyticsHandler.addPhysicalActivityRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.PhysicalActivityStand,
                null,
                model.Stand,
                null,
                null,
                null,
                model.Unit,
                appNames,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    public addEHRRecordStepCount = (model: StepCountDto, appNames?: string) => {
        if (model.StepCount) {
            EHRAnalyticsHandler.addPhysicalActivityRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.PhysicalActivityStepCounts,
                model.StepCount,
                null,
                null,
                null,
                null,
                model.Unit,
                appNames,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    public addEHRRecordPhysicalActivity = (model: PhysicalActivityDto, appNames?: string) => {
        if (model.PhysicalActivityQuestionAns !== null) {
            EHRAnalyticsHandler.addPhysicalActivityRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.PhysicalActivity,
                null,
                null,
                null,
                'Did you add movement to your day today?',
                model.PhysicalActivityQuestionAns,
                null,
                appNames,
                model.CreatedAt ? model.CreatedAt : null
            );
        }

        if (model.DurationInMin) {
            EHRAnalyticsHandler.addPhysicalActivityRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.PhysicalActivityExercise,
                null,
                null,
                model.DurationInMin,
                null,
                null,
                'mins',
                appNames,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }

    };

    public async addEHRRecordStandForAppNames(r: StandDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for await (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordStand(r, JSON.stringify(appNames));
    }

    public async addEHRRecordStepCountForAppNames(r: StepCountDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for await (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordStepCount(r, JSON.stringify(appNames));
    }

    public async addEHRRecordPhysicalActivityForAppNames(r: PhysicalActivityDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for await (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordPhysicalActivity(r, JSON.stringify(appNames));
    }

}
