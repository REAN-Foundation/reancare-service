import StepCount from '../../models/daily.records/step.count.model';
import { StepCountDto } from '../../../../../domain.types/daily.records/step.count/step.count.dto';

///////////////////////////////////////////////////////////////////////////////////

export class StepCountMapper {

    static toDto = (stepCount: StepCount): StepCountDto => {
        if (stepCount == null){
            return null;
        }

        const dto: StepCountDto = {
            id            : stepCount.id,
            PatientUserId : stepCount.PatientUserId,
            StepCount     : parseInt(String(stepCount.StepCount)),
            Unit          : stepCount.Unit,
            RecordDate    : stepCount.RecordDate,
        };
        return dto;
    }

}
