import { FormDto } from "../../../domain.types/clinical/assessment/form.types";
import {
    ThirdpartyApiCredentialsDomainModel,
    ThirdpartyApiCredentialsDto
} from "../../../domain.types/thirdparty/thirdparty.api.credentials";

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IFormsService {

    getFormsList(connectionModel: ThirdpartyApiCredentialsDto): Promise<FormDto[]>;

    providerName(): string;

    connect(connectionModel: ThirdpartyApiCredentialsDomainModel): Promise<boolean>;

}
