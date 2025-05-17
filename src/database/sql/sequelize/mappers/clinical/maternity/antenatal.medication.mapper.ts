import { AntenatalMedicationDto } from '../../../../../../domain.types/clinical/maternity/antenatal.medication/antenatal.medication.dto';
import AntenatalMedicationModel from '../../../models/clinical/maternity/antenatal.medication.model';

///////////////////////////////////////////////////////////////////////////////////

export class AntenatalMedicationMapper {

    static toDto = (
        medication: AntenatalMedicationModel): AntenatalMedicationDto => {
        if (medication == null) {
            return null;
        }
        
        const dto: AntenatalMedicationDto = {
            id              : medication.id,
            AnteNatalVisitId: medication.AnteNatalVisitId,
            PregnancyId     : medication.PregnancyId,
            VisitId         : medication.VisitId,
            Name            : medication.Name,
            Given           : medication.Given,
            MedicationId    : medication.MedicationId,
        };
        return dto;
    };

}