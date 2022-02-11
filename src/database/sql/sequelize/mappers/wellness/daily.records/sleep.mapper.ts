import { SleepDto } from '../../../../../../domain.types/wellness/daily.records/sleep/sleep.dto';
import Sleep from '../../../models/wellness/daily.records/sleep.model';

///////////////////////////////////////////////////////////////////////////////////

export class SleepMapper {

    static toDto = (sleep: Sleep): SleepDto => {
        
        if (sleep == null){
            return null;
        }

        const dto: SleepDto = {
            id            : sleep.id,
            PatientUserId : sleep.PatientUserId,
            Unit          : sleep.Unit,
            SleepDuration : sleep.SleepDuration,
            RecordDate    : sleep.RecordDate,
        };
        return dto;
    };

}
