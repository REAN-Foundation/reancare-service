import { ThirdpartyApiCredentialsDomainModel, ThirdpartyApiCredentialsDto } from "../../../domain.types/thirdparty/thirdparty.api.credentials";

export interface IThirdpartyApiRepo {

    addThirdpartyCredentials(userId: string, connectionModel: ThirdpartyApiCredentialsDomainModel)
        : Promise<ThirdpartyApiCredentialsDto>;

    getThirdpartyCredentials(userId: string, provider: string, baseUrl: string): Promise<ThirdpartyApiCredentialsDto>;

    getThirdpartyCredentialsForUser(userId: string, provider: string): Promise<ThirdpartyApiCredentialsDto[]>;

}
