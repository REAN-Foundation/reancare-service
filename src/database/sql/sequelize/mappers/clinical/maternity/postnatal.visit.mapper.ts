import { PostnatalVisitDto } from '../../../../../../domain.types/clinical/maternity/postnatal.visit/postnatal.visit.dto';
import PostnatalVisitModel from '../../../models/clinical/maternity/postnatal.visit.model';

///////////////////////////////////////////////////////////////////////////////////

export class PostnatalVisitMapper {

    static toDto = (
        visit: PostnatalVisitModel): PostnatalVisitDto => {
        if (visit == null) {
            return null;
        }
        const dto: PostnatalVisitDto = {
            id               : visit.id,
            DeliveryId       : visit.DeliveryId,
            PatientUserId     : visit.PatientUserId,
            DateOfVisit       : visit.DateOfVisit,
            BodyWeightId      : visit.BodyWeightId,
            ComplicationId    : visit.ComplicationId,
            BodyTemperatureId : visit.BodyTemperatureId,
            BloodPressureId   : visit.BloodPressureId,
        };
        return dto;
    };

}