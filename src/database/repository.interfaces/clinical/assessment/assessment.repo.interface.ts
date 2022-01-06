import { AssessmentDomainModel } from '../../../../domain.types/clinical/assessment/assessment.domain.model';
import { AssessmentDto } from "../../../../domain.types/clinical/assessment/assessment.dto";
import { AssessmentSearchFilters, AssessmentSearchResults } from '../../../../domain.types/clinical/assessment/assessment.search.types';

export interface IAssessmentRepo {

    create(bloodGlucoseDomainModel: AssessmentDomainModel): Promise<AssessmentDto>;

    getById(id: string): Promise<AssessmentDto>;

    search(filters: AssessmentSearchFilters): Promise<AssessmentSearchResults>;

    update(id: string, bloodGlucoseDomainModel: AssessmentDomainModel): Promise<AssessmentDto>;

    delete(id: string): Promise<boolean>;

}
