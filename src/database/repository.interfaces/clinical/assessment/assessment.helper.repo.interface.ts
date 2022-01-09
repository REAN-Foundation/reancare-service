import { AssessmentTemplate } from '../../../../domain.types/clinical/assessment/types/assessment.template';
import { AssessmentTemplateDomainModel } from '../../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateDto } from "../../../../domain.types/clinical/assessment/assessment.template.dto";
import { AssessmentTemplateSearchFilters, AssessmentTemplateSearchResults } from '../../../../domain.types/clinical/assessment/assessment.template.search.types';

export interface IAssessmentHelperRepo {

    addTemplate(assessment: AssessmentTemplate): Promise<AssessmentTemplateDto>;

    create(model: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto>;

    getById(id: string): Promise<AssessmentTemplateDto>;

    getByProviderAssessmentCode(Provider: string, ProviderActionId: string): Promise<AssessmentTemplateDto>;

    search(filters: AssessmentTemplateSearchFilters): Promise<AssessmentTemplateSearchResults>;

    update(id: string, model: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto>;

    delete(id: string): Promise<boolean>;

}
