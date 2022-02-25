//import { SAssessmentTemplate } from "../../../domain.types/clinical/assessment/assessment.types";
//import { ThirdpartyApiCredentials } from "../../../domain.types/miscellaneous/thirdparty.api.credentials";

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IFormsService {

    providerName(): string;

    connect(baseUrl: string, token: string): Promise<boolean>;

}
