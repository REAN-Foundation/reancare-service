import { injectable } from "tsyringe";
import { Logger } from "../../../common/logger";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { BloodGlucoseService } from "../../../services/clinical/biometrics/blood.glucose.service";
import { BloodPressureService } from "../../../services/clinical/biometrics/blood.pressure.service";
import { PulseService } from "../../../services/clinical/biometrics/pulse.service";
import { BodyWeightService } from "../../../services/clinical/biometrics/body.weight.service";
import { BodyHeightService } from "../../../services/clinical/biometrics/body.height.service";
import { BodyTemperatureService } from "../../../services/clinical/biometrics/body.temperature.service";
import { BloodOxygenSaturationService } from "../../../services/clinical/biometrics/blood.oxygen.saturation.service";
import EHRVitalData from "../models/ehr.vital.data.model";
import { Injector } from "../../../startup/injector";
import { PatientAppNameCache } from "../patient.appname.cache";
import { EHRRecordTypes } from "../ehr.domain.models/ehr.record.types";
import { BloodPressureDto } from "../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BloodGlucoseDto } from "../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto";
import { PulseDto } from "../../../domain.types/clinical/biometrics/pulse/pulse.dto";
import { BodyHeightDto } from "../../../domain.types/clinical/biometrics/body.height/body.height.dto";
import { BodyTemperatureDto } from "../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto";
import { BodyWeightDto } from "../../../domain.types/clinical/biometrics/body.weight/body.weight.dto";
import { BloodOxygenSaturationDto } from "../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRVitalService {

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _bloodGlucoseService: BloodGlucoseService = Injector.Container.resolve(BloodGlucoseService);

    _bloodPressureService: BloodPressureService = Injector.Container.resolve(BloodPressureService);

    _pulseService: PulseService = Injector.Container.resolve(PulseService);

    _bodyWeightService: BodyWeightService = Injector.Container.resolve(BodyWeightService);

    _bodyHeightService: BodyHeightService = Injector.Container.resolve(BodyHeightService);

    _bodyTemperatureService: BodyTemperatureService = Injector.Container.resolve(BodyTemperatureService);

    _bloodOxygenSaturationService: BloodOxygenSaturationService = Injector.Container.resolve(BloodOxygenSaturationService);

    public scheduleExistingVitalDataToEHR = async () => {
        await this.scheduleExistingVitalData("BloodPressure");
        await this.scheduleExistingVitalData("BloodGlucose");
        await this.scheduleExistingVitalData("BodyWeight");
        await this.scheduleExistingVitalData("BodyHeight");
        await this.scheduleExistingVitalData("BodyTemperature");
        await this.scheduleExistingVitalData("BloodOxygenSaturation");
        await this.scheduleExistingVitalData("Pulse");
    }

    public scheduleExistingVitalData = async (model : string) => {
        try {

            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex    : pageIndex,
                    ItemsPerPage : 1000,
                };

                var searchResults = null;
                switch (model) {
                    case "BloodGlucose" :
                        searchResults = await this._bloodGlucoseService.search(filters);
                        for await (var r of searchResults.Items) {
                            await this.addEHRBloodGlucoseForAppNames(r);
                        }
                        break;
                    
                        case "BloodPressure" :
                            searchResults = await this._bloodPressureService.search(filters);
                            for await (var r of searchResults.Items) {
                                await this.addEHRBloodPressureForAppNames(r);
                            }
                        break;

                        case "Pulse" :
                            searchResults = await this._pulseService.search(filters);
                            for await (var r of searchResults.Items) {
                                await this.addEHRPulseForAppNames(r);
                            }
                        break;

                        case "BodyWeight" :
                            searchResults = await this._bodyWeightService.search(filters);
                            for await (var r of searchResults.Items) {
                                await this.addEHRBodyWeightForAppNames(r);
                            }
                        break;

                        case "BodyHeight" :
                            searchResults = await this._bodyHeightService.search(filters);
                            for await (var r of searchResults.Items) {
                                await this.addEHRBodyHeightForAppNames(r);
                            }
                        break;

                        case "BodyTemperature" :
                            searchResults = await this._bodyTemperatureService.search(filters);
                            for await (var r of searchResults.Items) {
                                await this.addEHRBodyTemperatureForAppNames(r);
                            }
                        break;

                        case "BloodOxygenSaturation" :
                            searchResults = await this._bloodOxygenSaturationService.search(filters);
                            for await (var r of searchResults.Items) {
                                await this.addEHRBloodOxygenSaturationForAppNames(r);
                            }
                        break;        
                    
                }
                pageIndex++;
                Logger.instance().log(`[ScheduleExistingVitalDataToEHR] Processed :${searchResults.Items.length} records for ${model}`);

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }

            }
            
        }
        catch (error) {
            Logger.instance().log(`[ScheduleExistingVitalDataToEHR] Error population existing vitals data in ehr insights database: ${JSON.stringify(error)}`);
        }
    };

    public deleteVitalEHRRecord = async (id: string ) => {
        try {
            const result = await EHRVitalData.destroy({ where: { RecordId: id } });
            Logger.instance().log(`EHR vital record deleted : ${JSON.stringify(result)}`);
        } catch (error) {
            Logger.instance().log(error.message);
        }
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
                    BodyHeight: model.BodyHeight,
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
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        for (var appName of eligibleAppNames) {
            this.addEHRRecordBodyHeight(r, appName);
        }
    }

    public async addEHRBodyTemperatureForAppNames(r: BodyTemperatureDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        for (var appName of eligibleAppNames) {
            this.addEHRRecordBodyTemerature(r, appName);
        }
    }

    public async addEHRBodyWeightForAppNames(r: BodyWeightDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        for (var appName of eligibleAppNames) { 
            this.addEHRRecordBodyWeight(r, appName);
        }
    }

    public async addEHRBloodOxygenSaturationForAppNames(r: BloodOxygenSaturationDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        for (var appName of eligibleAppNames) { 
            this.addEHRRecordBloodOxygenSaturation(r, appName);
        }
    }

    public async addEHRBloodPressureForAppNames(r: BloodPressureDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        for (var appName of eligibleAppNames) { 
            this.addEHRRecordBloodPressure(r, appName);
        }
    }

    public async addEHRPulseForAppNames(r: PulseDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        for (var appName of eligibleAppNames) { 
            this.addEHRRecordPulse(r, appName);
        }
    }

    public async addEHRBloodGlucoseForAppNames(r: BloodGlucoseDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        for (var appName of eligibleAppNames) { 
            this.addEHRRecordBloodGlucose(r, appName);
        }
    }

}
