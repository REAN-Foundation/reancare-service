import { uuid } from "../../miscellaneous/system.types";

export interface AssessmentTemplateDto {
    id?                    : uuid;
    DisplayCode?           : string;
    Type                   : string;
    Title                  : string;
    Description?           : string;
    ProviderAssessmentCode?: string;
    Provider?              : string;
}
