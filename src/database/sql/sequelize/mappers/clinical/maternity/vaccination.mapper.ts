import { VaccinationDto } from '../../../../../../domain.types/clinical/maternity/vaccination/vaccination.dto';
import VaccinationModel from '../../../models/clinical/maternity/vaccination.model';

///////////////////////////////////////////////////////////////////////////////////

export class VaccinationMapper {

    static toDto = (vaccination: VaccinationModel): VaccinationDto => {
        if (vaccination == null) {
            return null;
        }
        
        const dto: VaccinationDto = {
            id                    : vaccination.id,
            PregnancyId           : vaccination.PregnancyId,
            VaccineName           : vaccination.VaccineName,
            DoseNumber            : vaccination.DoseNumber,
            DateAdministered      : vaccination.DateAdministered,
            MedicationId          : vaccination.MedicationId,
            MedicationConsumptionId: vaccination.MedicationConsumptionId,
        };
        return dto;
    };

}
