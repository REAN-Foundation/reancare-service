import { MoveMinutesDto } from '../../../../../../domain.types/wellness/daily.records/move.minutes/move.minutes.dto';
import MoveMinutesModel from '../../../models/wellness/daily.records/move.minutes.model';

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
