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

    public addEHRRecordStand = (model: StandDto, appName?: string) => {
        if (model.Stand) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.PhysicalActivity,
                model.Stand,
                model.Unit,
                'Stand',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    public addEHRRecordStepCount = (model: StepCountDto, appName?: string) => {
        if (model.StepCount) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                model.Provider ? model.Provider : null,
                EHRRecordTypes.PhysicalActivity,
                model.StepCount,
                model.Unit,
                'Step-count',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    public addEHRRecordPhysicalActivity = (model: PhysicalActivityDto, appName?: string) => {
        if (model.PhysicalActivityQuestionAns !== null) {
            EHRAnalyticsHandler.addBooleanRecord(
                model.PatientUserId,
                model.id,
                model.Provider ? model.Provider : null,
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
                model.PatientUserId,
                model.id,
                model.Provider ? model.Provider : null,
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

    public async addEHRRecordStandForAppNames(r: StandDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordStand(r, null);
        }
    }

    public async addEHRRecordStepCountForAppNames(r: StepCountDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordStepCount(r, null);
        }
    }

    public async addEHRRecordPhysicalActivityForAppNames(r: PhysicalActivityDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordPhysicalActivity(r, null);
        }
    }

}
