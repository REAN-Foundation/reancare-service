import { ThirdpartyApiCredentialsDomainModel } from "../../../domain.types/thirdparty/thirdparty.api.credentials";

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IFormsService {

    providerName(): string;

    connect(connectionModel: ThirdpartyApiCredentialsDomainModel): Promise<boolean>;

}
