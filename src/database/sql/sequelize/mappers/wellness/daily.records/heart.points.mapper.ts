import { HeartPointsDto } from '../../../../../../domain.types/wellness/daily.records/heart.points/heart.points.dto';
import HeartPoints from '../../../models/wellness/daily.records/heart.points.model';

///////////////////////////////////////////////////////////////////////////////////

export class HeartPointsMapper {

    static toDto = (heartPoint: HeartPoints): HeartPointsDto => {
        if (heartPoint == null){
            return null;
        }

        const dto: HeartPointsDto = {
            id            : heartPoint.id,
            PatientUserId : heartPoint.PatientUserId,
            HeartPoints   : heartPoint.HeartPoints,
            Unit          : heartPoint.Unit,
            RecordDate    : heartPoint.RecordDate,
        };
        return dto;
    }

}
