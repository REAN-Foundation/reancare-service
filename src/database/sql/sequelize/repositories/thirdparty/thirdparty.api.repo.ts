import { IThirdpartyApiRepo } from '../../../../../database/repository.interfaces/thirdparty/thirdparty.api.repo.interface';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { ThirdpartyApiCredentialsDomainModel, ThirdpartyApiCredentialsDto } from '../../../../../domain.types/thirdparty/thirdparty.api.credentials';
import { ThirdpartyApiCredentialsMapper } from './../../mappers/thirdparty/thirdparty.api.credentials.mapper';
import ThirdpartyApiCredentials from './../../models/thirdparty/thirdparty.api.credentials.model';
import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////

export class ThirdpartyApiRepo implements IThirdpartyApiRepo {

    addThirdpartyCredentials = async (userId: string, connectionModel: ThirdpartyApiCredentialsDomainModel)
        : Promise<ThirdpartyApiCredentialsDto> => {
        throw new Error('Method not implemented.');
    }

    getThirdpartyCredentials = async (userId: string, provider: string, baseUrl: string)
        : Promise<ThirdpartyApiCredentialsDto> => {
        throw new Error('Method not implemented.');
    }

}
