import { injectable } from "tsyringe";
import { Logger } from "../../common/logger";
import { EHRAnalyticsHandler } from "./ehr.analytics.handler";
import { PatientService } from "../../services/users/patient/patient.service";
import { Loader } from "../../startup/loader";
import { MedicationConsumptionService } from "../../services/clinical/medication/medication.consumption.service";
import MedicationConsumption from "../../database/sql/sequelize/models/clinical/medication/medication.consumption.model";
import EHRMedicationData from "./models/ehr.medication.data.model";

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
            var patientUserIds = await this._patientService.getAllPatientUserIds();
            Logger.instance().log(`[ScheduleExistingMedicationDataToEHR] Patient User Ids :${JSON.stringify(patientUserIds)}`);

            for await (var p of patientUserIds) {
                var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(p);
                if (eligibleAppNames.length > 0) {
                    var moreItems = true;
                    var pageIndex = 0;   
                    while (moreItems) {
                        var filters = {
                            PageIndex     : pageIndex,
                            ItemsPerPage  : 1000,
                            PatientUserId : p,
                            DateTo        : new Date(),
                        };
                        var searchResults = await this._medicationConsumptionService.search(filters);
                        Logger.instance().log(`[ScheduleExistingMedicationDataToEHR] Consumption records for ${p} :: ${searchResults.Items.length}`);
                        for await (var appName of eligibleAppNames) {
                            for await (var m of searchResults.Items) {
                                this._medicationConsumptionService.addEHRRecord(m.PatientUserId, m.id, m, appName);
                            }
                        }
                        pageIndex++;
                        if (searchResults.Items.length < 1000) {
                            moreItems = false;
                        }
                    }
                } else {
                    Logger.instance().log(`[ScheduleExistingMedicationDataToEHR] Skip adding details to EHR database as device is not eligible:${p}`);
                }   
            }
                Logger.instance().log(`[ScheduleExistingMedicationDataToEHR] Processed :${searchResults.Items.length} records for medication`);       
            } catch (error) {
            Logger.instance().log(`[ScheduleExistingMedicationDataToEHR] Error population existing medication data in ehr insights database :: ${JSON.stringify(error)}`);
        }
    };

    deleteMedicationEHRRecord = async (id: string ) => {
        try {
            const results = await MedicationConsumption.findAll({ where: { MedicationId: id} });
            for await (var r of results) {
                var deleted = await EHRMedicationData.destroy({ where: { RecordId: r.id } });
            }
            Logger.instance().log(`EHR medication record deleted : ${JSON.stringify(deleted)}`);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

}
