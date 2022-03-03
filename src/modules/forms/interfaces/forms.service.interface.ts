import { AssessmentTemplateDto } from "../../../domain.types/clinical/assessment/assessment.template.dto";
import { FormDto } from "../../../domain.types/clinical/assessment/form.types";
import {
    ThirdpartyApiCredentialsDomainModel,
    ThirdpartyApiCredentialsDto
} from "../../../domain.types/thirdparty/thirdparty.api.credentials";

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IFormsService {

    downloadForm(connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string): Promise<string>;

    importFormFileAsAssessmentTemplate(connectionModel: ThirdpartyApiCredentialsDto, downloadedFilepath: string)
        : Promise<AssessmentTemplateDto>;

    formExists(connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string): Promise<boolean>;

    getFormsList(connectionModel: ThirdpartyApiCredentialsDto): Promise<FormDto[]>;

    providerName(): string;

    connect(connectionModel: ThirdpartyApiCredentialsDomainModel): Promise<boolean>;

}
