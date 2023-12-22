import { injectable } from "tsyringe";
import { Logger } from "../../common/logger";
import { EHRAnalyticsHandler } from "./ehr.analytics.handler";
import { Loader } from "../../startup/loader";
import { SleepService } from "../../services/wellness/daily.records/sleep.service";
import { MeditationService } from "../../services/wellness/exercise/meditation.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRMentalWellBeingService {

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _sleepService: SleepService = null;

    _meditationService: MeditationService = null;

    constructor(
    ) {
        this._sleepService = Loader.container.resolve(SleepService);
        this._meditationService = Loader.container.resolve(MeditationService);
    }

    public scheduleExistingMentalWellBeingDataToEHR = async (model : string) => {
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
                        case "Sleep" :
                            searchResults = await this._sleepService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for await (var appName of eligibleAppNames) { 
                                        this._sleepService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`[ScheduleExistingMentalWellBeingDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;

                        case "Meditation" :
                            searchResults = await this._meditationService.search(filters);
                            for await (var r of searchResults.Items) {
                                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                                if (eligibleAppNames.length > 0) {
                                    for await (var appName of eligibleAppNames) { 
                                        this._meditationService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                                    }
                                } else {
                                    Logger.instance().log(`[ScheduleExistingMentalWellBeingDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                                }     
                            }
                        break;     
                    
                }
                pageIndex++;
                Logger.instance().log(`[ScheduleExistingMentalWellBeingDataToEHR] Processed :${searchResults.Items.length} records for ${model}`);

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }

            }
            
        }
        catch (error) {
            Logger.instance().log(`[ScheduleExistingMentalWellBeingDataToEHR] Error population existing data in ehr insights database: ${JSON.stringify(error)}`);
        }
    };

}
