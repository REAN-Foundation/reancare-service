import { Helper } from "../../../common/helper";
import { inject, injectable } from "tsyringe";
import { IAssessmentHelperRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { IAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { AssessmentTemplateDomainModel } from '../../../domain.types/clinical/assessment/assessment.template.domain.model';
import { AssessmentTemplateDto } from '../../../domain.types/clinical/assessment/assessment.template.dto';
import { AssessmentTemplateSearchFilters, AssessmentTemplateSearchResults } from "../../../domain.types/clinical/assessment/assessment.template.search.types";
import { AssessmentNodeType, CAssessmentListNode, CAssessmentMessageNode, CAssessmentNode, CAssessmentQuestionNode, CAssessmentTemplate, CScoringCondition } from "../../../domain.types/clinical/assessment/assessment.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { AssessmentTemplateFileConverter } from "./assessment.template.file.converter";
import { AssessmentNodeSearchFilters } from "../../../domain.types/clinical/assessment/assessment.node.search.types";
import { AssessmentNodeSearchResults } from "../../../domain.types/clinical/assessment/assessment.node.search.types";

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
    };

    public readTemplateObjToExport = async (templateId: uuid): Promise<CAssessmentTemplate> => {
        var template = await this._assessmentHelperRepo.readTemplateAsObj(templateId);
        template = this.sanitizeTemplateForExport(template);
        return template;
    };

    public import = async (model: any): Promise<AssessmentTemplateDto> => {
        var template: CAssessmentTemplate = model as CAssessmentTemplate;
        return await this.addTemplate(template);
    };

    public addTemplate = async (template: CAssessmentTemplate): Promise<AssessmentTemplateDto> => {
        const resource = await AssessmentTemplateFileConverter.storeAssessmentTemplate(template);
        template.FileResourceId = resource.id;
        return await this._assessmentHelperRepo.addTemplate(template);
    };

    getNode = async (nodeId: string): Promise<any> => {
        return await this._assessmentHelperRepo.getNodeById(nodeId);
    };

    deleteNode = async (nodeId: string): Promise<boolean> => {
        return await this._assessmentHelperRepo.deleteNode(nodeId);
    };

    addNode = async (
        model: CAssessmentNode | CAssessmentListNode | CAssessmentQuestionNode | CAssessmentMessageNode) => {
        return await this._assessmentHelperRepo.createNode(model.TemplateId, model.ParentNodeId, model);
    };

    updateNode = async(nodeId: uuid, updates: any) => {
        return await this._assessmentHelperRepo.updateNode(nodeId, updates);
    };

    sanitizeTemplateForExport = (template: CAssessmentTemplate): CAssessmentTemplate => {

        delete template.TemplateId;

        for (var node of template.Nodes) {
            delete node.id;
            delete node.TemplateId;
            delete node.ParentNodeId;

            if (node.NodeType === AssessmentNodeType.NodeList) {
                delete (node as CAssessmentListNode).ChildrenNodeIds;
                delete (node as CAssessmentListNode).Children;
            }
            else if (node.NodeType === AssessmentNodeType.Question) {
                for (var option of (node as CAssessmentQuestionNode).Options) {
                    delete option.id;
                    delete option.NodeId;
                }
                for (var path of (node as CAssessmentQuestionNode).Paths) {
                    delete path.id;
                    delete path.ParentNodeId;
                    delete path.ConditionId;
                    delete path.NextNodeId;
                }
            }
            else if (node.NodeType === AssessmentNodeType.Message) {
                delete (node as CAssessmentMessageNode).Acknowledged;
            }
        }

        return template;
    };

    addScoringCondition = async(model: CScoringCondition): Promise<CScoringCondition> => {
        return await this._assessmentHelperRepo.addScoringCondition(model);
    };

    getScoringCondition = async(conditionId: uuid): Promise<CScoringCondition> => {
        return await this._assessmentHelperRepo.getScoringCondition(conditionId);
    };

    updateScoringCondition = async(conditionId: uuid, updates: any): Promise<CScoringCondition> => {
        return await this._assessmentHelperRepo.updateScoringCondition(conditionId, updates);
    };

    deleteScoringCondition = async(conditionId: uuid): Promise<boolean> => {
        return await this._assessmentHelperRepo.deleteScoringCondition(conditionId);
    };

    public searchNode = async (filters: AssessmentNodeSearchFilters): Promise<AssessmentNodeSearchResults> => {
        return await this._assessmentHelperRepo.searchNode(filters);
    };

}
