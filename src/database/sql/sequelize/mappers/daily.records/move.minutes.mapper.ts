import MoveMinutesModel from '../../models/daily.records/move.minutes.model';
import { MoveMinutesDto } from '../../../../../domain.types/daily.records/move.minutes/move.minutes.dto';

///////////////////////////////////////////////////////////////////////////////////

export class MoveMinutesMapper {

    static toDto = (
        moveMinutes: MoveMinutesModel): MoveMinutesDto => {
        if (moveMinutes == null) {
            return null;
        }
        const dto: MoveMinutesDto = {
            id            : moveMinutes.id,
            PatientUserId : moveMinutes.PatientUserId,
            MoveMinutes   : moveMinutes.MoveMinutes,
            Unit          : moveMinutes.Unit,
            RecordDate    : moveMinutes.RecordDate
        };
        return dto;
        
    }

}
