import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { AssessmentNodeType,CAssessmentNode } from "./assessment.types";

export interface AssessmentNodeSearchFilters extends BaseSearchFilters{
  Title?          : string;
  NodeType?       : AssessmentNodeType;
  TemplateId?     : string;
}

export interface AssessmentNodeSearchResults extends BaseSearchResults{
    Items: CAssessmentNode[];
}
