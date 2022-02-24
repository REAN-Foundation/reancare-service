import { inject, injectable } from "tsyringe";
import { IAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { IAssessmentHelperRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { IAssessmentRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { AssessmentTemplateDomainModel } from '../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateDto } from '../../../domain.types/clinical/assessment/assessment.template.dto';
import { AssessmentTemplateSearchFilters, AssessmentTemplateSearchResults } from "../../../domain.types/clinical/assessment/assessment.template.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class FormsService {

    constructor(
        @inject('IAssessmentTemplateRepo') private _assessmentTemplateRepo: IAssessmentTemplateRepo,
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo,
        @inject('IFormsRepo') private _formsRepo: IFormsRepo,
    ) {}

    // public create = async (assessmentDomainModel: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto> => {
    //     return await this._assessmentRepo.create(assessmentDomainModel);
    // };

    // public getById = async (id: string): Promise<AssessmentTemplateDto> => {
    //     return await this._assessmentRepo.getById(id);
    // };

    // public search = async (filters: AssessmentTemplateSearchFilters): Promise<AssessmentTemplateSearchResults> => {
    //     return await this._assessmentRepo.search(filters);
    // };

    // public update = async (id: string, assessmentDomainModel: AssessmentTemplateDomainModel):
    //     Promise<AssessmentTemplateDto> => {
    //     return await this._assessmentRepo.update(id, assessmentDomainModel);
    // };

    // public delete = async (id: string): Promise<boolean> => {
    //     return await this._assessmentRepo.delete(id);
    // };

}
