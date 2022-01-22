import { SAssessmentNode, SAssessmentTemplate } from '../../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentTemplateDto } from "../../../../domain.types/clinical/assessment/assessment.template.dto";
import { uuid } from '../../../../domain.types/miscellaneous/system.types';

export interface IAssessmentHelperRepo {

    getNodeListChildren(nodeId: string): Promise<SAssessmentNode[]>;

    addTemplate(template: SAssessmentTemplate): Promise<AssessmentTemplateDto>;

    getNodeById(nodeId: uuid): Promise<SAssessmentNode>;
}
