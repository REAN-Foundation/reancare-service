import HeartPoints from '../../models/daily.records/heart.points.model';
import { HeartPointsDto } from '../../../../../domain.types/daily.records/heart.points/heart.points.dto';

///////////////////////////////////////////////////////////////////////////////////

export class HeartPointsMapper {

    static toDto = (heartPoint: HeartPoints): HeartPointsDto => {
        if (heartPoint == null){
            return null;
        }

        const dto: HeartPointsDto = {
            id            : heartPoint.id,
            PersonId      : heartPoint.PersonId,
            PatientUserId : heartPoint.PatientUserId,
            HeartPoints   : heartPoint.HeartPoints,
            Unit          : heartPoint.Unit,
            Person        : null
        };
        return dto;
    }

}
