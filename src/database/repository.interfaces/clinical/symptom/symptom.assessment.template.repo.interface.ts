import { SymptomAssessmentTemplateDomainModel } from "../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.domain.model";
import { SymptomAssessmentTemplateDto } from "../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.dto";
import { SymptomAssessmentTemplateSearchFilters, SymptomAssessmentTemplateSearchResults } from "../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.search.types";

export interface ISymptomAssessmentTemplateRepo {

    create(addressDomainModel: SymptomAssessmentTemplateDomainModel): Promise<SymptomAssessmentTemplateDto>;

    getById(id: string): Promise<SymptomAssessmentTemplateDto>;

    exists(id: string): Promise<boolean>;

    search(filters: SymptomAssessmentTemplateSearchFilters): Promise<SymptomAssessmentTemplateSearchResults>;

    update(id: string, addressDomainModel: SymptomAssessmentTemplateDomainModel): Promise<SymptomAssessmentTemplateDto>;

    delete(id: string): Promise<boolean>;

    addSymptomTypes(id: string, symptomTypeIds: string[]): Promise<SymptomAssessmentTemplateDto>;

    removeSymptomTypes(id: string, symptomTypeIds: string[]): Promise<SymptomAssessmentTemplateDto>;

    totalCount(): Promise<number>;

}
