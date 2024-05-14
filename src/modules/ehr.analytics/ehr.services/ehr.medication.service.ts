import { injectable } from "tsyringe";
import { Logger } from "../../../common/logger";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { MedicationConsumptionService } from "../../../services/clinical/medication/medication.consumption.service";
import EHRMedicationData from "../models/ehr.medication.data.model";
import { MedicationConsumptionDetailsDto } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto";
import { Injector } from "../../../startup/injector";
import { PatientAppNameCache } from "../patient.appname.cache";
import { MedicationConsumptionSearchFilters } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRMedicationService {

    _medicationConsumptionService: MedicationConsumptionService = Injector.Container.resolve(MedicationConsumptionService);

    public deleteMedicationEHRRecords = async (id: string) => {
        try {
            const filters: MedicationConsumptionSearchFilters = {
                MedicationId : id,
            };
            const results = await this._medicationConsumptionService.search(filters);
            const consumptionIds = results.Items.map((x) => x.id);
            var deleted = await EHRMedicationData.destroy({ where: { RecordId: consumptionIds } });
            Logger.instance().log(`EHR medication record deleted : ${JSON.stringify(deleted)}`);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public addEHRRecord = (model: MedicationConsumptionDetailsDto, appName?: string) => {
        if (model.IsTaken === false && model.IsMissed === false) {
            EHRAnalyticsHandler.addMedicationRecord(
                appName,
                model.id,
                model.PatientUserId,
                model.DrugName,
                model.Dose.toString(),
                model.Details,
                model.TimeScheduleStart,
                model.TimeScheduleEnd,
                model.TakenAt,
                model.IsTaken,
                model.IsMissed,
                model.IsCancelled,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }

        if (model.IsTaken) {
            EHRAnalyticsHandler.addMedicationRecord(
                appName,
                model.id,
                model.PatientUserId,
                model.DrugName,
                model.Dose.toString(),
                model.Details,
                model.TimeScheduleStart,
                model.TimeScheduleEnd,
                model.TakenAt,
                model.IsTaken,
                model.IsMissed,
                model.IsCancelled,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }

        if (model.IsMissed) {
            EHRAnalyticsHandler.addMedicationRecord(
                appName,
                model.id,
                model.PatientUserId,
                model.DrugName,
                model.Dose.toString(),
                model.Details,
                model.TimeScheduleStart,
                model.TimeScheduleEnd,
                model.TakenAt,
                model.IsTaken,
                model.IsMissed,
                model.IsCancelled,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
    };

    public async addEHRMedicationConsumptionForAppNames(r: MedicationConsumptionDetailsDto) {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(r.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecord(r, null);
        }
    }

}
