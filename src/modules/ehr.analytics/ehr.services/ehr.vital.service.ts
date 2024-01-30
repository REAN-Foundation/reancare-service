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

    private addEHRRecordBloodGlucose = (model: BloodGlucoseDto, appNames?: string) => {
        if (model.BloodGlucose) {
            EHRAnalyticsHandler.addVitalRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.BloodGlucose,
                model.BloodGlucose,
                null,
                null,
                null,
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

    private addEHRRecordBloodPressure = (
        model: BloodPressureDto,
        appNames?: string) => {

        if (model.Systolic) {
            EHRAnalyticsHandler.addVitalRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.BloodPressure,
                null,
                model.Systolic,
                null,
                null,
                null,
                null,
                null,
                null,
                model.Unit,
                appNames,
                model.RecordDate ? model.RecordDate : null
            );
        }
        if (model.Diastolic) {
            EHRAnalyticsHandler.addVitalRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.BloodPressure,
                null,
                null,
                model.Diastolic,
                null,
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

    private addEHRRecordPulse = (model: PulseDto, appNames?: string) => {
        if (model.Pulse) {
            EHRAnalyticsHandler.addVitalRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Pulse,
                null,
                null,
                null,
                model.Pulse,
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

    private addEHRRecordBodyHeight = (model: BodyHeightDto, appNames?: string) => {
        if (model.BodyHeight) {
            EHRAnalyticsHandler.addVitalRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.BodyHeight,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                model.BodyHeight,
                model.Unit,
                appNames,
                model.RecordDate ? model.RecordDate : null
            );

            //Also add it to the static record
            EHRAnalyticsHandler.addOrUpdatePatient(
                model.PatientUserId,
                {
                    BodyHeight : model.BodyHeight,
                },
                appNames
            );
        }
    };

    private addEHRRecordBodyWeight = (model: BodyWeightDto, appNames?: string) => {
        if (model.BodyWeight) {
            EHRAnalyticsHandler.addVitalRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.BodyWeight,
                null,
                null,
                null,
                null,
                null,
                model.BodyWeight,
                null,
                null,
                model.Unit,
                appNames,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    private addEHRRecordBodyTemerature = (model: BodyTemperatureDto, appNames?: string) => {
        if (model.BodyTemperature) {
            EHRAnalyticsHandler.addVitalRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.BodyTemperature,
                null,
                null,
                null,
                null,
                null,
                null,
                model.BodyTemperature,
                null,
                model.Unit,
                appNames,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    private addEHRRecordBloodOxygenSaturation = (model: BloodOxygenSaturationDto, appNames?: string) => {
        if (model.BloodOxygenSaturation) {
            EHRAnalyticsHandler.addVitalRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.BodyTemperature,
                null,
                null,
                null,
                null,
                model.BloodOxygenSaturation,
                null,
                null,
                null,
                model.Unit,
                appNames,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    public async addEHRBodyHeightForAppNames(r: BodyHeightDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordBodyHeight(r, JSON.stringify(appNames));
    }

    public async addEHRBodyTemperatureForAppNames(r: BodyTemperatureDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordBodyTemerature(r, JSON.stringify(appNames));
    }

    public async addEHRBodyWeightForAppNames(r: BodyWeightDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordBodyWeight(r, JSON.stringify(appNames));
    }

    public async addEHRBloodOxygenSaturationForAppNames(r: BloodOxygenSaturationDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordBloodOxygenSaturation(r, JSON.stringify(appNames));
    }

    public async addEHRBloodPressureForAppNames(r: BloodPressureDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordBloodPressure(r, JSON.stringify(appNames));
    }

    public async addEHRPulseForAppNames(r: PulseDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordPulse(r, JSON.stringify(appNames));
    }

    public async addEHRBloodGlucoseForAppNames(r: BloodGlucoseDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecordBloodGlucose(r, JSON.stringify(appNames));
    }

}
