import { SymptomAssessmentDomainModel } from "../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.domain.model";
import { SymptomAssessmentDto } from "../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.dto";
import { SymptomAssessmentSearchFilters, SymptomAssessmentSearchResults } from "../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.search.types";

export interface ISymptomAssessmentRepo {

    create(addressDomainModel: SymptomAssessmentDomainModel): Promise<SymptomAssessmentDto>;

    getById(id: string): Promise<SymptomAssessmentDto>;

    search(filters: SymptomAssessmentSearchFilters): Promise<SymptomAssessmentSearchResults>;

    update(id: string, addressDomainModel: SymptomAssessmentDomainModel): Promise<SymptomAssessmentDto>;

    delete(id: string): Promise<boolean>;

}
