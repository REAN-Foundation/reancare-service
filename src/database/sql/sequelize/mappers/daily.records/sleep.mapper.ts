import Sleep from '../../models/daily.records/sleep.model';
import { SleepDto } from '../../../../../domain.types/daily.records/Sleep/sleep.dto';

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
    }

}
