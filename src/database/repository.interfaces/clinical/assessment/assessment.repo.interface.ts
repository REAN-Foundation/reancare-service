import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { AssessmentDomainModel } from '../../../../domain.types/clinical/assessment/assessment.domain.model';
import { AssessmentDto } from "../../../../domain.types/clinical/assessment/assessment.dto";
import { AssessmentSearchFilters, AssessmentSearchResults } from '../../../../domain.types/clinical/assessment/assessment.search.types';

///////////////////////////////////////////////////////////////////////////////////////////////

export interface IAssessmentRepo {

    create(model: AssessmentDomainModel): Promise<AssessmentDto>;

    getById(id: string): Promise<AssessmentDto>;

    search(filters: AssessmentSearchFilters): Promise<AssessmentSearchResults>;

    update(id: string, model: AssessmentDomainModel): Promise<AssessmentDto>;

    delete(id: string): Promise<boolean>;

    getByActivityId(activityId: uuid): Promise<AssessmentDto>;

    getByTemplateAndSchedule(templateId: uuid, sequence: number, scheduledDate: string): Promise<AssessmentDto>;

    getForPatient(patientUserId: uuid): Promise<AssessmentDto[]>;

    startAssessment(id: uuid): Promise<AssessmentDto>;

    setCurrentNode(assessmentId: string, id: string): Promise<AssessmentDto>;

    completeAssessment(assessmentId: string): Promise<AssessmentDto>;

    existsWithProviderSubmissionId(provider: string, providerSubmissionId: string): Promise<boolean>;

}
