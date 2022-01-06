import { AssessmentTemplateDomainModel } from '../../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateDto } from "../../../../domain.types/clinical/assessment/assessment.template.dto";
import { AssessmentTemplateSearchFilters, AssessmentTemplateSearchResults } from '../../../../domain.types/clinical/assessment/assessment.template.search.types';

export interface IAssessmentTemplateRepo {

    create(bloodGlucoseDomainModel: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto>;

    getById(id: string): Promise<AssessmentTemplateDto>;

    search(filters: AssessmentTemplateSearchFilters): Promise<AssessmentTemplateSearchResults>;

    update(id: string, bloodGlucoseDomainModel: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto>;

    delete(id: string): Promise<boolean>;

}
