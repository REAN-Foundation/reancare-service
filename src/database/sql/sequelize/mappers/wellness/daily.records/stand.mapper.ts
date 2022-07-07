import { StandDto } from '../../../../../../domain.types/wellness/daily.records/stand/stand.dto';
import Stand from '../../../models/wellness/daily.records/stand.model';

///////////////////////////////////////////////////////////////////////////////////

export class StandMapper {

    static toDto = (stand: Stand): StandDto => {
        if (stand == null){
            return null;
        }

        const dto: StandDto = {
            id            : stand.id,
            PatientUserId : stand.PatientUserId,
            Stand         : stand.Stand,
            Unit          : stand.Unit,
            RecordDate    : stand.RecordDate,
        };
        return dto;
    };

}
