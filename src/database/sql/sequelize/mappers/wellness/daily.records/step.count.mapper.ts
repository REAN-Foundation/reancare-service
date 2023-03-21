import { StepCountDto } from '../../../../../../domain.types/wellness/daily.records/step.count/step.count.dto';
import StepCount from '../../../models/wellness/daily.records/step.count.model';

///////////////////////////////////////////////////////////////////////////////////

export class StepCountMapper {

    static toDto = (stepCount: StepCount): StepCountDto => {
        if (stepCount == null){
            return null;
        }

        const dto: StepCountDto = {
            id             : stepCount.id,
            PatientUserId  : stepCount.PatientUserId,
            TerraSummaryId : stepCount.TerraSummaryId,
            Provider       : stepCount.Provider,
            StepCount      : stepCount.StepCount,
            Unit           : stepCount.Unit,
            RecordDate     : stepCount.RecordDate,
        };
        return dto;
    };

}
