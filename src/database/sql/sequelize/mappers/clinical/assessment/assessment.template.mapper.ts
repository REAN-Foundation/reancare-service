import AssessmentTemplate from '../../../models/clinical/assessment/assessment.template.model';
import { AssessmentTemplateDto } from '../../../../../../domain.types/clinical/assessment/assessment.template.dto';
import { AssessmentType } from '../../../../../../domain.types/clinical/assessment/assessment.types';

///////////////////////////////////////////////////////////////////////////////////

export class AssessmentTemplateMapper {

    static toDto = (template: AssessmentTemplate): AssessmentTemplateDto => {
        if (template == null){
            return null;
        }

        const dto: AssessmentTemplateDto = {
            id                     : template.id,
            DisplayCode            : template.DisplayCode,
            Title                  : template.Title,
            Type                   : template.Type as AssessmentType,
            Description            : template.Description,
            Provider               : template.Provider,
            ProviderAssessmentCode : template.ProviderAssessmentCode,
            RootNodeId             : template.RootNodeId,
            FileResourceId         : template.FileResourceId,
        };
        return dto;
    };

}
