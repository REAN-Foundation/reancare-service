import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { AssessmentTemplateDomainModel } from '../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateDto } from '../../../domain.types/clinical/assessment/assessment.template.dto';
import { AssessmentTemplateSearchFilters, AssessmentTemplateSearchResults } from "../../../domain.types/clinical/assessment/assessment.template.search.types";
import { Logger } from "../../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentTemplateService {

    constructor(
        @inject('IAssessmentTemplateRepo') private _assessmentRepo: IAssessmentTemplateRepo,
    ) {}

    public create = async (assessmentDomainModel: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto> => {
        return await this._assessmentRepo.create(assessmentDomainModel);
    };

    public getById = async (id: uuid): Promise<AssessmentTemplateDto> => {
        return await this._assessmentRepo.getById(id);
    };

    public search = async (filters: AssessmentTemplateSearchFilters): Promise<AssessmentTemplateSearchResults> => {
        return await this._assessmentRepo.search(filters);
    };

    public update = async (id: uuid, assessmentDomainModel: AssessmentTemplateDomainModel):
        Promise<AssessmentTemplateDto> => {
        return await this._assessmentRepo.update(id, assessmentDomainModel);
    };

    public delete = async (id: uuid): Promise<boolean> => {
        return await this._assessmentRepo.delete(id);
    };

    public import = async (model: any): Promise<uuid> => {

        Logger.instance().log(JSON.stringify(model, null, 2));
        
        return null;
    };

}
