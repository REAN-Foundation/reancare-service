import { inject, injectable } from "tsyringe";
import { IThirdpartyApiRepo } from "../../database/repository.interfaces/general/thirdparty.api.repo.interface";
import { ThirdpartyApiCredentialsDomainModel, ThirdpartyApiCredentialsDto } from '../../domain.types/thirdparty/thirdparty.api.credentials';
import { uuid } from "../../domain.types/miscellaneous/system.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ThirdpartyApiService {

    constructor(
        @inject('IThirdpartyApiRepo') private _thirdpartyApiRepo: IThirdpartyApiRepo,
    ) {}

    getThirdpartyCredentialsForUser = async (userId: uuid, provider: string)
        : Promise<ThirdpartyApiCredentialsDto[]> => {
        return await this._thirdpartyApiRepo.getThirdpartyCredentialsForUser(userId, provider);
    };

    getThirdpartyCredentials = async (userId: uuid, provider: string, baseUrl: string)
        : Promise<ThirdpartyApiCredentialsDto> => {
        return await this._thirdpartyApiRepo.getThirdpartyCredentials(userId, provider, baseUrl);
    };

    addThirdpartyCredentials = async (userId: uuid, connectionModel: ThirdpartyApiCredentialsDomainModel)
        : Promise<ThirdpartyApiCredentialsDto> => {
        return await this._thirdpartyApiRepo.addThirdpartyCredentials(userId, connectionModel);
    };

}
