import { injectable } from "tsyringe";
import { Logger } from "../../common/logger";
import { EHRAnalyticsHandler } from "./ehr.analytics.handler";
import { Loader } from "../../startup/loader";
import { LabRecordService } from "../../services/clinical/lab.record/lab.record.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRLabService {

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _labRecordService: LabRecordService = null;

    constructor(
    ) {
        this._labRecordService = Loader.container.resolve(LabRecordService);
    }

    public scheduleExistingLabDataToEHR = async () => {
        try {

            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex    : pageIndex,
                    ItemsPerPage : 1000,
                };

                var searchResults = null;
                
                searchResults = await this._labRecordService.search(filters);
                for await (var r of searchResults.Items) {
                    var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(r.PatientUserId);
                    if (eligibleAppNames.length > 0) {
                        for await (var appName of eligibleAppNames) { 
                            this._labRecordService.addEHRRecord(r.PatientUserId, r.id, r.Provider, r, appName);
                        }
                    } else {
                        Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${r.PatientUserId}`);
                    }     
                }
                
                pageIndex++;
                Logger.instance().log(`Processed :${searchResults.Items.length} records for lab`);

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }

            }
            
        }
        catch (error) {
            Logger.instance().log(`Error population existing data in ehr insights database: ${JSON.stringify(error)}`);
        }
    };

}
