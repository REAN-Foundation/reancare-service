import { Op } from 'sequelize';
import { AssessmentTemplateSearchFilters } from '../../../../../../domain.types/clinical/assessment/assessment.template.search.types';
// import { AssessmentTemplateSearchResults } from '../../../../../../domain.types/clinical/assessment/assessment.template.search.types';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
// import { AssessmentTemplateDomainModel } from '../../../../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateDto } from '../../../../../../domain.types/clinical/assessment/assessment.template.dto';
import { IAssessmentHelperRepo } from '../../../../../repository.interfaces/clinical/assessment/assessment.helper.repo.interface';
import { AssessmentTemplateMapper } from '../../../mappers/clinical/assessment/assessment.template.mapper';
import AssessmentTemplate from '../../../models/clinical/assessment/assessment.template.model';
import { SAssessmentTemplate } from '../../../../../../domain.types/clinical/assessment/assessment.types';

///////////////////////////////////////////////////////////////////////

export class AssessmentHelperRepo implements IAssessmentHelperRepo {

    addTemplate = async (template: SAssessmentTemplate): Promise<AssessmentTemplateDto> => {
        try {
            // const entity = {
            //     DisplayCode            : model.DisplayCode ?? null,
            //     Type                   : model.Type ?? null,
            //     Title                  : model.Title ?? model.Title,
            //     Description            : model.Description ?? null,
            //     ProviderAssessmentCode : model.ProviderAssessmentCode ?? null,
            //     Provider               : model.Provider ?? null,
            // };
            // const assessmentTemplate = await AssessmentTemplate.create(entity);
            // return await AssessmentTemplateMapper.toDto(assessmentTemplate);
            return null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
