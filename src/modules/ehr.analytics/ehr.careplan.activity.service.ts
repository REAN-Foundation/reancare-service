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
            for await (var p of patientUserIds) {
                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(p);
                var healthSystemHospitalDetails = await this._patientService.getByUserId(p);
                if (eligibleAppNames.length > 0) { 
                    var startTime = new Date("2020-01-01");
                    var endTime = new Date("2024-12-01");
                    var searchResults = await this._careplanService.getActivities(p, startTime, endTime);
                    for await (var m of searchResults) {
                        for await (var appName of eligibleAppNames) { 
                            this._careplanService.addEHRRecord(m.PlanName, m.PlanCode, m, appName, healthSystemHospitalDetails);
                        }
                    }
                    
                } else {
                    Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${p}`);
                }      
            }
            Logger.instance().log(`Processed :${searchResults.length} records for careplan activity`);
            
        } catch (error) {
            Logger.instance().log(`Error population existing assessment data in ehr insights database :: ${JSON.stringify(error)}`);
        }
    };

}
