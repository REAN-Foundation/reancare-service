import { injectable } from "tsyringe";
import { Logger } from "../../common/logger";
import { EHRAnalyticsHandler } from "./ehr.analytics.handler";
import { Loader } from "../../startup/loader";
import { StandService } from "../../services/wellness/daily.records/stand.service";
import { StepCountService } from "../../services/wellness/daily.records/step.count.service";
import { PhysicalActivityService } from "../../services/wellness/exercise/physical.activity.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRPhysicalActivityService {

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _standService: StandService = null;

    _stepCountService: StepCountService = null;

    _physicalActivityService: PhysicalActivityService = null;

    constructor(
    ) {
        this._standService = Loader.container.resolve(StandService);
        this._stepCountService = Loader.container.resolve(StepCountService);
        this._physicalActivityService = Loader.container.resolve(PhysicalActivityService);
    }

    public scheduleExistingPhysicalActivityDataToEHR = async (model : string) => {
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
                    case "Stand" :
                        searchResults = await this._standService.search(filters);
                        for await (var r of searchResults.Items) {
                            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                            if (eligibleAppNames.length > 0) {
                                for await (var appName of eligibleAppNames) { 
                                    this._standService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                }
                            } else {
                                Logger.instance().log(`[ScheduleExistingPhysicalActivityDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                            }     
                        }
                    break;

                    case "StepCount" :
                        searchResults = await this._stepCountService.search(filters);
                        for await (var r of searchResults.Items) {
                            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                            if (eligibleAppNames.length > 0) {
                                for await (var appName of eligibleAppNames) { 
                                    this._stepCountService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                }
                            } else {
                                Logger.instance().log(`[ScheduleExistingPhysicalActivityDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                            }     
                        }
                    break;

                    case "PhysicalActivity" :
                        searchResults = await this._physicalActivityService.search(filters);
                        for await (var r of searchResults.Items) {
                            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                            if (eligibleAppNames.length > 0) {
                                for await (var appName of eligibleAppNames) { 
                                    this._physicalActivityService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                }
                            } else {
                                Logger.instance().log(`[ScheduleExistingPhysicalActivityDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                            }     
                        }
                    break;     
                    
                }
                pageIndex++;
                Logger.instance().log(`[ScheduleExistingPhysicalActivityDataToEHR] Processed :${searchResults.Items.length} records for ${model}`);

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }

            }
            
        }
        catch (error) {
            Logger.instance().log(`[ScheduleExistingPhysicalActivityDataToEHR] Error population existing physical activity data in ehr insights database:  ${JSON.stringify(error)}`);
        }
    };

}
