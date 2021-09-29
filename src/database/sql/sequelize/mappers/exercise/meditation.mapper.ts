import MeditationModel from '../../models/exercise/meditation.model';
import { MeditationDto } from '../../../../../domain.types/exercise/meditation/meditation.dto';

///////////////////////////////////////////////////////////////////////////////////

export class MeditationMapper {

    static toDto = (
        meditation: MeditationModel): MeditationDto => {
        if (meditation == null) {
            return null;
        }
        const dto: MeditationDto = {
            id            : meditation.id,
            EhrId         : meditation.EhrId,
            PatientUserId : meditation.PatientUserId,
            Meditation    : meditation.Meditation,
            Description   : meditation.Description,
            Category      : meditation.Category,
            StartTime     : meditation.StartTime,
            EndTime       : meditation.EndTime

        };
        return dto;
    }

}
