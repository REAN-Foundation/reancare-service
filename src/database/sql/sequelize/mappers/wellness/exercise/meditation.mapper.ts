import { MeditationDto } from '../../../../../../domain.types/wellness/exercise/meditation/meditation.dto';
import MeditationModel from '../../../models/wellness/exercise/meditation.model';

///////////////////////////////////////////////////////////////////////////////////

export class MeditationMapper {

    static toDto = (
        meditation: MeditationModel): MeditationDto => {
        if (meditation == null) {
            return null;
        }
        const dto: MeditationDto = {
            id             : meditation.id,
            EhrId          : meditation.EhrId,
            PatientUserId  : meditation.PatientUserId,
            Meditation     : meditation.Meditation,
            Description    : meditation.Description,
            Category       : meditation.Category,
            DurationInMins : meditation.DurationInMins,
            StartTime      : meditation.StartTime,
            EndTime        : meditation.EndTime,
            CreatedAt      : meditation.CreatedAt,
            UpdatedAt      : meditation.UpdatedAt

        };
        return dto;
    };

}
