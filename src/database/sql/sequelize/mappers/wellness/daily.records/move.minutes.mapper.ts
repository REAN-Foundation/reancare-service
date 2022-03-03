import { MoveMinutesDto } from '../../../../../../domain.types/wellness/daily.records/move.minutes/move.minutes.dto';
import MoveMinutesModel from '../../../models/wellness/daily.records/move.minutes.model';

///////////////////////////////////////////////////////////////////////////////////

export class MoveMinutesMapper {

    static toDto = (
        moveMinutes: MoveMinutesModel): MoveMinutesDto => {
        if (moveMinutes == null) {
            return null;
        }
        var minutes = typeof moveMinutes.MoveMinutes === 'string' ? parseInt(moveMinutes.MoveMinutes) : moveMinutes.MoveMinutes;

        const dto: MoveMinutesDto = {
            id            : moveMinutes.id,
            PatientUserId : moveMinutes.PatientUserId,
            MoveMinutes   : minutes,
            Unit          : moveMinutes.Unit,
            RecordDate    : moveMinutes.RecordDate
        };
        return dto;
        
    };

}
