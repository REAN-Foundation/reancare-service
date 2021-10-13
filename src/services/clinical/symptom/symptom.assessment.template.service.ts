import { inject, injectable } from "tsyringe";
import { ISymptomAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/symptom/symptom.assessment.template.repo.interface";
import { SymptomAssessmentTemplateDomainModel } from '../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.domain.model';
import { SymptomAssessmentTemplateDto } from '../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.dto';
import { SymptomAssessmentTemplateSearchResults, SymptomAssessmentTemplateSearchFilters } from '../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class SymptomAssessmentTemplateService {

    constructor(
        @inject('ISymptomAssessmentTemplateRepo') private _symptomAssessmentTemplateRepo: ISymptomAssessmentTemplateRepo,
    ) {}

    create = async (addressDomainModel: SymptomAssessmentTemplateDomainModel)
        : Promise<SymptomAssessmentTemplateDto> => {
        return await this._symptomAssessmentTemplateRepo.create(addressDomainModel);
    };

    getById = async (id: string): Promise<SymptomAssessmentTemplateDto> => {
        return await this._symptomAssessmentTemplateRepo.getById(id);
    };

    exists = async (id: string): Promise<boolean> => {
        return await this._symptomAssessmentTemplateRepo.exists(id);
    };

    search = async (filters: SymptomAssessmentTemplateSearchFilters)
        : Promise<SymptomAssessmentTemplateSearchResults> => {
        return await this._symptomAssessmentTemplateRepo.search(filters);
    };

    update = async (id: string, addressDomainModel: SymptomAssessmentTemplateDomainModel)
        : Promise<SymptomAssessmentTemplateDto> => {
        return await this._symptomAssessmentTemplateRepo.update(id, addressDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._symptomAssessmentTemplateRepo.delete(id);
    };

    addSymptomTypes = async (id: string, symptomTypeIds: string[]): Promise<SymptomAssessmentTemplateDto> => {
        return await this._symptomAssessmentTemplateRepo.addSymptomTypes(id, symptomTypeIds);
    };

    removeSymptomTypes = async (id: string, symptomTypeIds: string[]): Promise<SymptomAssessmentTemplateDto> => {
        return await this._symptomAssessmentTemplateRepo.removeSymptomTypes(id, symptomTypeIds);
    };

}
