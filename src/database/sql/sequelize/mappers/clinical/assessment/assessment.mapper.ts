import Assessment from '../../../models/clinical/assessment/assessment.model';
import { AssessmentDto } from '../../../../../../domain.types/clinical/assessment/assessment.dto';
import { AssessmentType } from '../../../../../../domain.types/clinical/assessment/assessment.types';
import { ProgressStatus } from '../../../../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////

export class AssessmentMapper {

    static toDto = (assessment: Assessment): AssessmentDto => {

        if (assessment == null){
            return null;
        }

        const dto: AssessmentDto = {
            id                     : assessment.id,
            Type                   : assessment.Type as AssessmentType,
            DisplayCode            : assessment.DisplayCode,
            Title                  : assessment.Title,
            Description            : assessment.Description,
            PatientUserId          : assessment.PatientUserId,
            AssessmentTemplateId   : assessment.AssessmentTemplateId,
            Provider               : assessment.Provider,
            ProviderEnrollmentId   : assessment.ProviderEnrollmentId,
            ProviderAssessmentCode : assessment.ProviderAssessmentCode,
            Status                 : assessment.Status as ProgressStatus,
            CreatedAt              : assessment.CreatedAt,
            StartedAt              : assessment.StartedAt,
            FinishedAt             : assessment.FinishedAt,
            ParentActivityId       : assessment.ParentActivityId,
            UserTaskId             : assessment.UserTaskId,
        };
        
        return dto;
    }

}
