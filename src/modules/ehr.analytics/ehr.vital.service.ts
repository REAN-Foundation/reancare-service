import { injectable } from "tsyringe";
import { Logger } from "../../common/logger";
import { EHRAnalyticsHandler } from "./ehr.analytics.handler";
import { Loader } from "../../startup/loader";
import { BloodGlucoseService } from "../../services/clinical/biometrics/blood.glucose.service";
import { BloodPressureService } from "../../services/clinical/biometrics/blood.pressure.service";
import { PulseService } from "../../services/clinical/biometrics/pulse.service";
import { BodyWeightService } from "../../services/clinical/biometrics/body.weight.service";
import { BodyHeightService } from "../../services/clinical/biometrics/body.height.service";
import { BodyTemperatureService } from "../../services/clinical/biometrics/body.temperature.service";
import { BloodOxygenSaturationService } from "../../services/clinical/biometrics/blood.oxygen.saturation.service";
import EHRVitalData from "./models/ehr.vital.data.model";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRVitalService {

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _bloodGlucoseService: BloodGlucoseService = null;

    _bloodPressureService: BloodPressureService = null;

    _pulseService: PulseService = null;

    _bodyWeightService: BodyWeightService = null;

    _bodyHeightService: BodyHeightService = null;

    _bodyTemperatureService: BodyTemperatureService = null;

    _bloodOxygenSaturationService: BloodOxygenSaturationService = null;

    constructor(
    ) {
        this._bloodGlucoseService = Loader.container.resolve(BloodGlucoseService);
        this._bloodPressureService = Loader.container.resolve(BloodPressureService);
        this._pulseService = Loader.container.resolve(PulseService);
        this._bodyWeightService = Loader.container.resolve(BodyWeightService);
        this._bodyHeightService = Loader.container.resolve(BodyHeightService);
        this._bodyTemperatureService = Loader.container.resolve(BodyTemperatureService);
        this._bloodOxygenSaturationService = Loader.container.resolve(BloodOxygenSaturationService);
    }

    public scheduleExistingVitalDataToEHR = async (model : string) => {
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
                            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                            if (eligibleAppNames.length > 0) {
                                for await (var appName of eligibleAppNames) { 
                                    this._bloodGlucoseService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                }
                            } else {
                                Logger.instance().log(`[ScheduleExistingVitalDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                            }     
                        }
                        break;
                    
                        case "BloodPressure" :
                            searchResults = await this._bloodPressureService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for await (var appName of eligibleAppNames) { 
                                        this._bloodPressureService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`[ScheduleExistingVitalDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "Pulse" :
                            searchResults = await this._pulseService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for await (var appName of eligibleAppNames) { 
                                        this._pulseService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`[ScheduleExistingVitalDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "BodyWeight" :
                            searchResults = await this._bodyWeightService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for await (var appName of eligibleAppNames) { 
                                        this._bodyWeightService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`[ScheduleExistingVitalDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "BodyHeight" :
                            searchResults = await this._bodyHeightService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for await (var appName of eligibleAppNames) { 
                                        this._bodyHeightService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`[ScheduleExistingVitalDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "BodyTemperature" :
                            searchResults = await this._bodyTemperatureService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for await (var appName of eligibleAppNames) { 
                                        this._bodyTemperatureService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`[ScheduleExistingVitalDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "BloodOxygenSaturation" :
                            searchResults = await this._bloodOxygenSaturationService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for await (var appName of eligibleAppNames) { 
                                        this._bloodOxygenSaturationService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`[ScheduleExistingVitalDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
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

    deleteVitalEHRRecord = async (id: string ) => {
        try {
            const result = await EHRVitalData.destroy({ where: { RecordId: id } });
            Logger.instance().log(`EHR vital record deleted : ${JSON.stringify(result)}`);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
