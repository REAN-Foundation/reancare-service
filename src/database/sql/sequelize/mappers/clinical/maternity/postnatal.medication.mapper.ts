import { PostnatalMedicationDto } from '../../../../../../domain.types/clinical/maternity/postnatal.medication/postnatal.medication.dto';
import PostnatalMedicationModel from '../../../models/clinical/maternity/postnatal.medication.model';

///////////////////////////////////////////////////////////////////////////////////

export class PostnatalMedicationMapper {

    static toDto = (medication: PostnatalMedicationModel): PostnatalMedicationDto => {
        if (medication == null) {
            return null;
        }
        
        const dto: PostnatalMedicationDto = {
            id              : medication.id,
            PostNatalVisitId: medication.PostNatalVisitId,
            DeliveryId     : medication.DeliveryId,
            VisitId         : medication.VisitId,
            Name            : medication.Name,
            Given           : medication.Given,
            MedicationId    : medication.MedicationId,
        };
        return dto;
    };
}