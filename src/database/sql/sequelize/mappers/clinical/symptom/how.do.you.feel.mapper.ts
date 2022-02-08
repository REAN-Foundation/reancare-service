import HowDoYouFeel from '../../../models/clinical/symptom/how.do.you.feel.model';
import { HowDoYouFeelDto } from '../../../../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.dto';
import { SymptomsProgress } from '../../../../../../domain.types/clinical/symptom/how.do.you.feel/symptom.progress.types';

///////////////////////////////////////////////////////////////////////////////////

export class HowDoYouFeelMapper {

    static toDto = (howDoYouFeel: HowDoYouFeel): HowDoYouFeelDto => {
        if (howDoYouFeel == null){
            return null;
        }

        const dto: HowDoYouFeelDto = {
            id            : howDoYouFeel.id,
            EhrId         : howDoYouFeel.EhrId,
            PatientUserId : howDoYouFeel.PatientUserId,
            Feeling       : howDoYouFeel.Feeling as SymptomsProgress,
            Comments      : howDoYouFeel.Comments,
            RecordDate    : howDoYouFeel.RecordDate,
        };
        return dto;
    };

}
