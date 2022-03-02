import { AssessmentTemplateDto } from "./assessment.template.dto";

export interface FormDto {
    Title              : string;
    Description?       : string;
    Provider           : string;
    ProviderId         : string;
    ProviderCode?      : string;
    ProviderVersion?   : string;
    Tags?              : string[];
    Url?               : string;
    CreatedAt?         : Date;
    UpdatedAt?         : Date;
    AssessmentTemplate?: AssessmentTemplateDto;
}

