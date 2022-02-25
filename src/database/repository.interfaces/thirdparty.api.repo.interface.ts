import { ThirdpartyApiCredentials, ThirdpartyApiCredentialsDto } from "../../domain.types/miscellaneous/thirdparty.api.credentials";

export interface IThirdpartyApiRepo {

    addThirdpartyCredentials(userId: string, connectionModel: ThirdpartyApiCredentials)
        : Promise<ThirdpartyApiCredentialsDto>;

    getThirdpartyCredentials(userId: string, provider: string, baseUrl: string): Promise<ThirdpartyApiCredentialsDto>;

}
