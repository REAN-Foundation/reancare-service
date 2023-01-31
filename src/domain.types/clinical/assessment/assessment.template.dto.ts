import { uuid } from "../../miscellaneous/system.types";
import { AssessmentType } from "./assessment.types";

export interface AssessmentTemplateDto {
    id?                           : uuid;
    DisplayCode?                  : string;
    Type                          : AssessmentType;
    Title                         : string;
    Description?                  : string;
    ServeListNodeChildrenAtOnce?  : boolean;
    ProviderAssessmentCode?       : string;
    ProviderAssessmentId?         : string;
    Provider?                     : string;
    ScoringApplicable?            : boolean;
    FileResourceId?               : uuid;
    RootNodeId?                   : uuid;
    QnAs?                         : any[];
    TotalNumberOfQuestions?       : number;
}
