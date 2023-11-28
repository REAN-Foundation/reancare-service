import { injectable } from "tsyringe";
import { Logger } from "../../common/logger";
import { EHRAnalyticsHandler } from "./ehr.analytics.handler";
import { Loader } from "../../startup/loader";
import { FoodConsumptionService } from "../../services/wellness/nutrition/food.consumption.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRNutritionService {

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _foodConsumptionService: FoodConsumptionService = null;

    constructor(
    ) {
        this._foodConsumptionService = Loader.container.resolve(FoodConsumptionService);
    }

    public scheduleExistingNutritionDataToEHR = async () => {
        try {

            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex    : pageIndex,
                    ItemsPerPage : 1000,
                };

                var searchResults = null;
                
                searchResults = await this._foodConsumptionService.search(filters);
                for await (var r of searchResults.Items) {
                    var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                    if (eligibleAppNames.length > 0) {
                        for await (var appName of eligibleAppNames) { 
                            this._foodConsumptionService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                        }
                    } else {
                        Logger.instance().log(`[ScheduleExistingNutritionDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                    }     
                }
                
                pageIndex++;
                Logger.instance().log(`[ScheduleExistingNutritionDataToEHR] Processed :${searchResults.Items.length} records for Nutrition`);

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }

            }
            
        }
        catch (error) {
            Logger.instance().log(`[ScheduleExistingNutritionDataToEHR] Error population existing nutrition data in ehr insights database: ${JSON.stringify(error)}`);
        }
    };

}
