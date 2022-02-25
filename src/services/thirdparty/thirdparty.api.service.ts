import { inject, injectable } from "tsyringe";
import { IThirdpartyApiRepo } from "../../database/repository.interfaces/thirdparty.api.repo.interface";
import { ThirdpartyApiCredentials, ThirdpartyApiCredentialsDto } from '../../domain.types/miscellaneous/thirdparty.api.credentials';
import { uuid } from "../../domain.types/miscellaneous/system.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ThirdpartyApiService {

    constructor(
        @inject('IThirdpartyApiepo') private _thirdpartyApiRepo: IThirdpartyApiRepo,
    ) {}

    getThirdpartyCredentials = async (userId: uuid, provider: string, baseUrl: string)
        : Promise<ThirdpartyApiCredentialsDto> => {
        return await this._thirdpartyApiRepo.getThirdpartyCredentials(userId, provider, baseUrl);
    };

    addThirdpartyCredentials = async (userId: uuid, connectionModel: ThirdpartyApiCredentials)
        : Promise<ThirdpartyApiCredentialsDto> => {
        return await this._thirdpartyApiRepo.addThirdpartyCredentials(userId, connectionModel);
    };

}
