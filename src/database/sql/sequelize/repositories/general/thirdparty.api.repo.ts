import { IThirdpartyApiRepo } from '../../../../repository.interfaces/general/thirdparty.api.repo.interface';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { ThirdpartyApiCredentialsDomainModel, ThirdpartyApiCredentialsDto } from '../../../../../domain.types/thirdparty/thirdparty.api.credentials';
import { ThirdpartyApiCredentialsMapper } from '../../mappers/general/thirdparty.api.credentials.mapper';
import ThirdpartyApiCredentials from '../../models/general/thirdparty/thirdparty.api.credentials.model';

///////////////////////////////////////////////////////////////////////

export class ThirdpartyApiRepo implements IThirdpartyApiRepo {

    addThirdpartyCredentials = async (userId: string, connectionModel: ThirdpartyApiCredentialsDomainModel)
        : Promise<ThirdpartyApiCredentialsDto> => {
        try {
            const entity = {
                UserId       : userId,
                Provider     : connectionModel.Provider ?? null,
                BaseUrl      : connectionModel.BaseUrl ?? null,
                SecondaryUrl : connectionModel.SecondaryUrl ?? null,
                Token        : connectionModel.Token ?? null,
                ValidTill    : connectionModel.ValidTill ?? null,
            };
            const creds = await ThirdpartyApiCredentials.create(entity);
            return ThirdpartyApiCredentialsMapper.toDto(creds);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getThirdpartyCredentials = async (userId: string, provider: string, baseUrl: string)
        : Promise<ThirdpartyApiCredentialsDto> => {
        try {
            const creds = await ThirdpartyApiCredentials.findOne({
                where : {
                    UserId   : userId,
                    Provider : provider,
                    BaseUrl  : baseUrl,
                }
            });
            return ThirdpartyApiCredentialsMapper.toDto(creds);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getThirdpartyCredentialsForUser = async (userId: string, provider: string)
        : Promise<ThirdpartyApiCredentialsDto[]> => {
        try {
            const credsList = await ThirdpartyApiCredentials.findAll({
                where : {
                    UserId   : userId,
                    Provider : provider
                }
            });
            return credsList.map(x => ThirdpartyApiCredentialsMapper.toDto(x));
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
