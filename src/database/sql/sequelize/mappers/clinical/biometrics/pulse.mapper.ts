import { PulseDto } from '../../../../../../domain.types/clinical/biometrics/pulse/pulse.dto';
import PulseModel from '../../../models/clinical/biometrics/pulse.model';

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
            TerraSummaryId   : pulse.TerraSummaryId,
            Provider         : pulse.Provider,
            Pulse            : pulse.Pulse,
            Unit             : pulse.Unit,
            RecordDate       : pulse.RecordDate,
            RecordedByUserId : pulse.RecordedByUserId
        };
        return dto;
    };

}
