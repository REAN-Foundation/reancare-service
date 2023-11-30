import { injectable } from "tsyringe";
import { Logger } from "../../common/logger";
import { EHRAnalyticsHandler } from "./ehr.analytics.handler";
import { Loader } from "../../startup/loader";
import { HowDoYouFeelService } from "../../services/clinical/symptom/how.do.you.feel.service";
import { DailyAssessmentService } from "../../services/clinical/daily.assessment/daily.assessment.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRSymptomService {

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _howDoYouFeelService: HowDoYouFeelService = null;

    _dailyAssessmentService: DailyAssessmentService = null;

    constructor(
    ) {
        this._howDoYouFeelService = Loader.container.resolve(HowDoYouFeelService);
        this._dailyAssessmentService = Loader.container.resolve(DailyAssessmentService);
    }

    public scheduleExistingSymptomDataToEHR = async () => {
        try {

            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex    : pageIndex,
                    ItemsPerPage : 1000,
                };

                var searchResults = null;                
                searchResults = await this._howDoYouFeelService.search(filters);

                for await (var r of searchResults.Items) {
                    var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                    if (eligibleAppNames.length > 0) {
                        for await (var appName of eligibleAppNames) { 
                            this._howDoYouFeelService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                        }
                    } else {
                        Logger.instance().log(`[ScheduleExistingSymptomDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                    }     
                }

                pageIndex++;
                Logger.instance().log(`[ScheduleExistingSymptomDataToEHR] Processed :${searchResults.Items.length} records for symptoms`);

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }

            }
            
            moreItems = true;
            pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex    : pageIndex,
                    ItemsPerPage : 1000,
                };

                var dailyAssessmentSearchResults = null;
                dailyAssessmentSearchResults = await this._dailyAssessmentService.search(filters);

                for await (var dr of dailyAssessmentSearchResults.Items) {
                    var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(dr.PatientUserId);
                    if (eligibleAppNames.length > 0) {
                        for await (var appName of eligibleAppNames) { 
                            this._dailyAssessmentService.addEHRRecord(dr.PatientUserId, dr.id, null, dr, appName);
                        }
                    } else {
                        Logger.instance().log(`[ScheduleExistingSymptomDataToEHR] Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                    }     
                }
                
                pageIndex++;
                Logger.instance().log(`[ScheduleExistingSymptomDataToEHR] Processed :${dailyAssessmentSearchResults.Items.length} records for daily assessment`);

                if (dailyAssessmentSearchResults.Items.length < 1000) {
                    moreItems = false;
                }

            }
        }
        catch (error) {
            Logger.instance().log(`[ScheduleExistingSymptomDataToEHR] Error population existing symptoms data in ehr insights database: ${JSON.stringify(error)}`);
        }
    };

}
