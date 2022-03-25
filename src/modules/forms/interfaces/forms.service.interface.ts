import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { FormDto } from "../../../domain.types/clinical/assessment/form.types";
import {
    ThirdpartyApiCredentialsDomainModel,
    ThirdpartyApiCredentialsDto
} from "../../../domain.types/thirdparty/thirdparty.api.credentials";
import { CAssessmentTemplate, QueryResponseType } from "../../../domain.types/clinical/assessment/assessment.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IFormsService {

    providerName(): string;

    connect(connectionModel: ThirdpartyApiCredentialsDomainModel): Promise<boolean>;
        
    downloadForm(connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string): Promise<string>;

    downloadFile(connectionModel: ThirdpartyApiCredentialsDto, fileUrl: string): Promise<string>;

    importFormFileAsAssessmentTemplate(userId: uuid, providerFormId: string, downloadedFilepath: string)
        : Promise<CAssessmentTemplate>;

    formExists(connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string): Promise<boolean>;

    getFormsList(connectionModel: ThirdpartyApiCredentialsDto): Promise<FormDto[]>;

    importFormSubmissions(connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string): Promise<any[]>;

    processQueryResponse(responseType: QueryResponseType, value: any);

}
