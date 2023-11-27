import { injectable } from "tsyringe";
import { Logger } from "../../common/logger";
import { EHRAnalyticsHandler } from "./ehr.analytics.handler";
import { PatientService } from "../../services/users/patient/patient.service";
import { Loader } from "../../startup/loader";
import { MedicationConsumptionService } from "../../services/clinical/medication/medication.consumption.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRMedicationService {

    _patientService: PatientService = null;

    _medicationConsumptionService: MedicationConsumptionService = null;

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    constructor(
    ) {
        this._patientService = Loader.container.resolve(PatientService);
        this._medicationConsumptionService = Loader.container.resolve(MedicationConsumptionService);
    }

    public scheduleExistingMedicationDataToEHR = async () => {
        try {

            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                
                var searchResults = null
                var patientUserIds = await this._patientService.getAllPatientUserIds();
                for await (var p of patientUserIds) {
                    var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(p);
                    if (eligibleAppNames.length > 0) {
                        for await (var appName of eligibleAppNames) { 
                            searchResults = await this._medicationConsumptionService.search({"PatientUserId" : p});
                            for await (var m of searchResults.Items) {
                                this._medicationConsumptionService.addEHRRecord(m.PatientUserId, m.id, m, appName);

                            }
                        }
                    } else {
                        Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${p}`);
                    }      
                }

                pageIndex++;
                Logger.instance().log(`Processed :${searchResults.Items.length} records for careplan activity`);

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }

            }
            
        }
        catch (error) {
            Logger.instance().log(`Error population existing assessment data in ehr insights database :: ${JSON.stringify(error)}`);
        }
    };

}
