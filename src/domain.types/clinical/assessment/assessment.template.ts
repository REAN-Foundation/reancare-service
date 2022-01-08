import { AssessmentTemplateNode } from "./assessment.template.node";
import { uuid } from "../../miscellaneous/system.types";

export interface AssessmentTemplate {
    id?                    : uuid;
    DisplayCode?           : string;
    Type                   : string;
    Title                  : string;
    Description?           : string;
    ProviderAssessmentCode?: string;
    Provider?              : string;

    AssessmentTemplateNodes : AssessmentTemplateNode[];
}
