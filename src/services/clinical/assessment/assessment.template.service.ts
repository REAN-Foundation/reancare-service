import { inject, injectable } from "tsyringe";
import { Logger } from "../../../common/logger";
import { IAssessmentHelperRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { IAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { AssessmentTemplateDomainModel } from '../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateDto } from '../../../domain.types/clinical/assessment/assessment.template.dto';
import { AssessmentTemplateSearchFilters, AssessmentTemplateSearchResults } from "../../../domain.types/clinical/assessment/assessment.template.search.types";
import { CAssessmentTemplate } from "../../../domain.types/clinical/assessment/assessment.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { AssessmentTemplateFileConverter } from "./assessment.template.file.converter";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AssessmentTemplateService {

    constructor(
        @inject('IAssessmentTemplateRepo') private _assessmentTemplateRepo: IAssessmentTemplateRepo,
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo,
    ) {}

    public create = async (assessmentDomainModel: AssessmentTemplateDomainModel): Promise<AssessmentTemplateDto> => {
        return await this._assessmentTemplateRepo.create(assessmentDomainModel);
    };

    public getById = async (id: uuid): Promise<AssessmentTemplateDto> => {
        return await this._assessmentTemplateRepo.getById(id);
    };

    public search = async (filters: AssessmentTemplateSearchFilters): Promise<AssessmentTemplateSearchResults> => {
        return await this._assessmentTemplateRepo.search(filters);
    };

    public update = async (id: uuid, assessmentDomainModel: AssessmentTemplateDomainModel):
        Promise<AssessmentTemplateDto> => {
        return await this._assessmentTemplateRepo.update(id, assessmentDomainModel);
    };

    public delete = async (id: uuid): Promise<boolean> => {
        return await this._assessmentTemplateRepo.delete(id);
    };

    public getByProviderAssessmentCode = async (provider: string, providerId: string) => {
        return await this._assessmentTemplateRepo.getByProviderAssessmentCode(
            provider, providerId);
    }

    public import = async (model: any): Promise<AssessmentTemplateDto> => {

        Logger.instance().log(JSON.stringify(model, null, 2));

        var tmpl: CAssessmentTemplate = model as CAssessmentTemplate;
        const resource = await AssessmentTemplateFileConverter.storeAssessmentTemplate(tmpl);
        tmpl.FileResourceId = resource.id;
        const assessmentTemplate = await this._assessmentHelperRepo.addTemplate(tmpl);

        return assessmentTemplate;
    };

}
