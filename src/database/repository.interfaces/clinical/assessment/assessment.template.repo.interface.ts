import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { AssessmentTemplateDomainModel } from '../../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateDto } from "../../../../domain.types/clinical/assessment/assessment.template.dto";
import { AssessmentTemplateSearchFilters, AssessmentTemplateSearchResults } from '../../../../domain.types/clinical/assessment/assessment.template.search.types';

export interface IAssessmentTemplateRepo {

    create(model: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto>;

    getById(id: uuid): Promise<AssessmentTemplateDto>;

    getByProviderAssessmentCode(Provider: string, ProviderActionId: string): Promise<AssessmentTemplateDto>;

    search(filters: AssessmentTemplateSearchFilters): Promise<AssessmentTemplateSearchResults>;

    update(id: uuid, model: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto>;

    delete(id: uuid): Promise<boolean>;

    updateFileResource(id: uuid, fileResourceId: uuid): Promise<AssessmentTemplateDto>;

}
