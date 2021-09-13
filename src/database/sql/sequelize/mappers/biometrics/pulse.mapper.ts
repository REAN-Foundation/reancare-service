import PulseModel from '../../models/biometrics/pulse.model';
import { PulseDto } from '../../../../../domain.types/biometrics/pulse/pulse.dto';

///////////////////////////////////////////////////////////////////////////////////

export class PulseMapper {

    static toDto = (
        pulse: PulseModel): PulseDto => {
        if (pulse == null) {
            return null;
        }
        const dto: PulseDto = {
            id               : pulse.id,
            EhrId            : pulse.EhrId,
            PatientUserId    : pulse.PatientUserId,
            Pulse            : pulse.Pulse,
            Unit             : pulse.Unit,
            RecordDate       : pulse.RecordDate,
            RecordedByUserId : pulse.RecordedByUserId
        };
        return dto;
    }

}
