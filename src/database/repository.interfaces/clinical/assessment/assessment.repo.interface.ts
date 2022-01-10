import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { AssessmentDomainModel } from '../../../../domain.types/clinical/assessment/assessment.domain.model';
import { AssessmentDto } from "../../../../domain.types/clinical/assessment/assessment.dto";
import { AssessmentSearchFilters, AssessmentSearchResults } from '../../../../domain.types/clinical/assessment/assessment.search.types';

export interface IAssessmentRepo {

    getByTemplateAndSchedule(templateId: uuid, sequence: number, scheduledAt: string): Promise<AssessmentDto>;

    create(model: AssessmentDomainModel): Promise<AssessmentDto>;

    getById(id: string): Promise<AssessmentDto>;

    search(filters: AssessmentSearchFilters): Promise<AssessmentSearchResults>;

    update(id: string, model: AssessmentDomainModel): Promise<AssessmentDto>;

    delete(id: string): Promise<boolean>;

}
