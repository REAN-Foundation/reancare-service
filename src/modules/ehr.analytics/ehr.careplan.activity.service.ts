import { injectable } from "tsyringe";
import { Logger } from "../../common/logger";
import { EHRAnalyticsHandler } from "./ehr.analytics.handler";
import { PatientService } from "../../services/users/patient/patient.service";
import { Loader } from "../../startup/loader";
import { CareplanService } from "../../services/clinical/careplan.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRCareplanActivityService {

    _patientService: PatientService = null;

     _careplanService: CareplanService = null;

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    constructor(
    ) {
        this._patientService = Loader.container.resolve(PatientService);
        this._careplanService = Loader.container.resolve(CareplanService);

    }

    public scheduleExistingCareplanActivityDataToEHR = async () => {
        try {    
            var patientUserIds = await this._patientService.getAllPatientUserIds();
            Logger.instance().log(`[ScheduleExistingCareplanActivityDataToEHR] Patient User Ids :${JSON.stringify(patientUserIds)}`);
            for await (var p of patientUserIds) {
                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(p);
                var healthSystemHospitalDetails = await this._patientService.getByUserId(p);
                if (eligibleAppNames.length > 0) { 
                    var startTime = new Date("2020-01-01");
                    var endTime = new Date("2024-12-01");
                    var searchResults = await this._careplanService.getActivities(p, startTime, endTime);
                    for await (var m of searchResults) {
                        for await (var appName of eligibleAppNames) {
                            if (appName == 'HF Helper' && m.PlanCode == 'HFMotivator') {
                                this._careplanService.addEHRRecord(m.PlanName, m.PlanCode, m, appName, healthSystemHospitalDetails);
                            } else if (appName == 'Heart &amp; Stroke Helper™' && (m.PlanCode == 'Cholesterol' || m.PlanCode == 'Stroke')) {
                                this._careplanService.addEHRRecord(m.PlanName, m.PlanCode, m, appName, healthSystemHospitalDetails);
                            } else if (appName == 'REAN HealthGuru' && (m.PlanCode == 'Cholesterol' || m.PlanCode == 'Stroke' || m.PlanCode == 'HFMotivator')) {
                                this._careplanService.addEHRRecord(m.PlanName, m.PlanCode, m, appName, healthSystemHospitalDetails);
                            }
                        }
                    }
                    
                } else {
                    Logger.instance().log(`[ScheduleExistingCareplanActivityDataToEHR] Skip adding details to EHR database as device is not eligible:${p}`);
                }      
            }
            Logger.instance().log(`[ScheduleExistingCareplanActivityDataToEHR] Processed :${searchResults.length} records for careplan activity`);
            
        } catch (error) {
            Logger.instance().log(`[ScheduleExistingCareplanActivityDataToEHR] Error population existing assessment data in ehr insights database :: ${JSON.stringify(error)}`);
        }
    };

}
