import { HeartPointsDto } from '../../../../../../domain.types/wellness/daily.records/heart.points/heart.points.dto';
import HeartPoints from '../../../models/wellness/daily.records/heart.points.model';

///////////////////////////////////////////////////////////////////////////////////

export class HeartPointsMapper {

    static toDto = (heartPoint: HeartPoints): HeartPointsDto => {
        if (heartPoint == null){
            return null;
        }

        var points = typeof heartPoint.HeartPoints === 'string' ? parseInt(heartPoint.HeartPoints) : heartPoint.HeartPoints;

        const dto: HeartPointsDto = {
            id            : heartPoint.id,
            PatientUserId : heartPoint.PatientUserId,
            HeartPoints   : points,
            Unit          : heartPoint.Unit,
            RecordDate    : heartPoint.RecordDate,
        };
        return dto;
    };

}
