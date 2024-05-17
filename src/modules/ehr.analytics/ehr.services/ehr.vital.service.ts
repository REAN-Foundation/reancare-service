import { injectable } from "tsyringe";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { PatientAppNameCache } from "../patient.appname.cache";
import { EHRRecordTypes } from "../ehr.domain.models/ehr.record.types";
import { BloodPressureDto } from "../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto";
import { BloodGlucoseDto } from "../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto";
import { PulseDto } from "../../../domain.types/clinical/biometrics/pulse/pulse.dto";
import { BodyHeightDto } from "../../../domain.types/clinical/biometrics/body.height/body.height.dto";
import { BodyTemperatureDto } from "../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto";
import { BodyWeightDto } from "../../../domain.types/clinical/biometrics/body.weight/body.weight.dto";
import { BloodOxygenSaturationDto } from "../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRVitalService {

    public deleteRecord = async (id: string ) => {
        await EHRAnalyticsHandler.deleteVitalsRecord(id);
    };

    private addEHRRecordBloodGlucose = (model: BloodGlucoseDto, appName?: string) => {
        if (model.BloodGlucose) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.BloodGlucose,
                model.BloodGlucose,
                model.Unit,
                null,
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    private addEHRRecordBloodPressure = (
        model: BloodPressureDto,
        appName?: string) => {

        if (model.Systolic) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.BloodPressure,
                model.Systolic,
                model.Unit,
                'Systolic Blood Pressure',
                'Blood Pressure',
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
        if (model.Diastolic) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.BloodPressure,
                model.Diastolic,
                model.Unit,
                'Distolic Blood Pressure',
                'Blood Pressure',
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    private addEHRRecordPulse = (model: PulseDto, appName?: string) => {
        if (model.Pulse) {
            EHRAnalyticsHandler.addIntegerRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Pulse,
                model.Pulse,
                model.Unit,
                null,
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    private addEHRRecordBodyHeight = (model: BodyHeightDto, appName?: string) => {
        if (model.BodyHeight) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.BodyHeight,
                model.BodyHeight,
                model.Unit,
                null,
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );

            //Also add it to the static record
            EHRAnalyticsHandler.addOrUpdatePatient(
                model.PatientUserId,
                {
                    BodyHeight : model.BodyHeight,
                },
                appName
            );
        }
    };

    private addEHRRecordBodyWeight = (model: BodyWeightDto, appName?: string) => {
        if (model.BodyWeight) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.BodyWeight,
                model.BodyWeight,
                model.Unit,
                null,
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    private addEHRRecordBodyTemerature = (model: BodyTemperatureDto, appName?: string) => {
        if (model.BodyTemperature) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.BodyTemperature,
                model.BodyTemperature,
                model.Unit,
                null,
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    private addEHRRecordBloodOxygenSaturation = (model: BloodOxygenSaturationDto, appName?: string) => {
        if (model.BloodOxygenSaturation) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.BloodOxygenSaturation,
                model.BloodOxygenSaturation,
                model.Unit,
                null,
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    public async addEHRBodyHeightForAppNames(r: BodyHeightDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordBodyHeight(r, null);
        }
    }

    public async addEHRBodyTemperatureForAppNames(r: BodyTemperatureDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordBodyTemerature(r, null);
        }
    }

    public async addEHRBodyWeightForAppNames(r: BodyWeightDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordBodyWeight(r, null);
        }
    }

    public async addEHRBloodOxygenSaturationForAppNames(r: BloodOxygenSaturationDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordBloodOxygenSaturation(r, null);
        }
    }

    public async addEHRBloodPressureForAppNames(r: BloodPressureDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordBloodPressure(r, null);
        }
    }

    public async addEHRPulseForAppNames(r: PulseDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordPulse(r, null);
        }
    }

    public async addEHRBloodGlucoseForAppNames(r: BloodGlucoseDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecordBloodGlucose(r, null);
        }
    }
    
}
