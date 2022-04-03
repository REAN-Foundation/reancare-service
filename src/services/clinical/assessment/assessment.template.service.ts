import { Helper } from "../../../common/helper";
import { inject, injectable } from "tsyringe";
import { IAssessmentHelperRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { IAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { AssessmentTemplateDomainModel } from '../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateDto } from '../../../domain.types/clinical/assessment/assessment.template.dto';
import { AssessmentTemplateSearchFilters, AssessmentTemplateSearchResults } from "../../../domain.types/clinical/assessment/assessment.template.search.types";
import { CAssessmentListNode, CAssessmentMessageNode, CAssessmentNode, CAssessmentQuestionNode, CAssessmentTemplate } from "../../../domain.types/clinical/assessment/assessment.types";
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
        if (!assessmentDomainModel.DisplayCode) {
            assessmentDomainModel.DisplayCode = Helper.generateDisplayCode('AssessmtTmpl');
        }
        var template = await this._assessmentTemplateRepo.create(assessmentDomainModel);
        template = await this._assessmentHelperRepo.addRootNode(template.id);
        return template;
    };

    public getById = async (id: uuid): Promise<AssessmentTemplateDto> => {
        var templateDto = await this._assessmentTemplateRepo.getById(id);
        
        return templateDto;
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

    public readTemplateObjToExport = async (templateId: uuid): Promise<CAssessmentTemplate> => {
        return await this._assessmentHelperRepo.readTemplateAsObj(templateId);
    }

    public import = async (model: any): Promise<AssessmentTemplateDto> => {

        //Logger.instance().log(JSON.stringify(model, null, 2));

        var tmpl: CAssessmentTemplate = model as CAssessmentTemplate;
        const resource = await AssessmentTemplateFileConverter.storeAssessmentTemplate(tmpl);
        tmpl.FileResourceId = resource.id;
        return await this._assessmentHelperRepo.addTemplate(tmpl);
    };

    public addTemplate = async (template: CAssessmentTemplate): Promise<AssessmentTemplateDto> => {
        const resource = await AssessmentTemplateFileConverter.storeAssessmentTemplate(template);
        template.FileResourceId = resource.id;
        return await this._assessmentHelperRepo.addTemplate(template);
    };

    getNodeById = async (nodeId: string): Promise<any> => {
        return await this._assessmentHelperRepo.getNodeById(nodeId);
    };

    deleteNode = async (nodeId: string): Promise<boolean> => {
        return await this._assessmentHelperRepo.deleteNode(nodeId);
    };

    addNode = async (
        model: CAssessmentNode | CAssessmentListNode | CAssessmentQuestionNode | CAssessmentMessageNode) => {
        return await this._assessmentHelperRepo.createNode(model.TemplateId, model.ParentNodeId, model);
    };

}
