import path from 'path';
import { Helper } from "../../../../common/helper";
import { MedicationConsumptionDomainModel } from '../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model';

///////////////////////////////////////////////////////////////////////////////////

export class MedicationConsumptionMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd,'src/modules/ehr/tests/test.data/','medication.consumption.domain.model.json');
        var medicationObj = Helper.jsonToObj(jsonPath);

        var model: MedicationConsumptionDomainModel = {
            MedicationId      : medicationObj.medConsumptions.Tylenol[0].MedicationId,
            DrugId            : medicationObj.medConsumptions.Tylenol[0].DrugId,
            PatientUserId     : medicationObj.medConsumptions.Tylenol[0].PatientUserId,
            DrugName          : medicationObj.medConsumptions.Tylenol[0].DrugName,
            Dose              : medicationObj.medConsumptions.Tylenol[0].Dose,
            Details           : medicationObj.medConsumptions.Tylenol[0].Details,
            TimeScheduleStart : medicationObj.medConsumptions.Tylenol[0].TimeScheduleStart,
            TimeScheduleEnd   : medicationObj.medConsumptions.Tylenol[0].TimeScheduleEnd,
            TakenAt           : medicationObj.medConsumptions.Tylenol[0].TakenAt,
            IsTaken           : medicationObj.medConsumptions.Tylenol[0].IsTaken,
            IsMissed          : medicationObj.medConsumptions.Tylenol[0].IsMissed,
            IsCancelled       : medicationObj.medConsumptions.Tylenol[0].IsCancelled,
            CancelledOn       : medicationObj.medConsumptions.Tylenol[0].CancelledOn,
            Note              : medicationObj.medConsumptions.Tylenol[0].Note,
        };

        return model;
    };

}
