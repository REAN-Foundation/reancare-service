// import { FileResourceUploadDomainModel } from "../../../domain.types/file.resource/file.resource.domain.model";
import { inject, injectable } from "tsyringe";
import { IAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { AssessmentTemplateDomainModel } from '../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateDto } from '../../../domain.types/clinical/assessment/assessment.template.dto';
import { AssessmentTemplateSearchFilters, AssessmentTemplateSearchResults } from "../../../domain.types/clinical/assessment/assessment.template.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentTemplateService {

    constructor(
        @inject('IAssessmentTemplateRepo') private _assessmentRepo: IAssessmentTemplateRepo,
    ) {}

    public create = async (assessmentDomainModel: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto> => {
        return await this._assessmentRepo.create(assessmentDomainModel);
    };

    public getById = async (id: string): Promise<AssessmentTemplateDto> => {
        return await this._assessmentRepo.getById(id);
    };

    public search = async (filters: AssessmentTemplateSearchFilters): Promise<AssessmentTemplateSearchResults> => {
        return await this._assessmentRepo.search(filters);
    };

    public update = async (id: string, assessmentDomainModel: AssessmentTemplateDomainModel):
        Promise<AssessmentTemplateDto> => {
        return await this._assessmentRepo.update(id, assessmentDomainModel);
    };

    public delete = async (id: string): Promise<boolean> => {
        return await this._assessmentRepo.delete(id);
    };

}
