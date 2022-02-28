import ThirdpartyApiCredentials from '../../models/thirdparty/thirdparty.api.credentials.model';
import { ThirdpartyApiCredentialsDto } from '../../../../../domain.types/thirdparty/thirdparty.api.credentials';

///////////////////////////////////////////////////////////////////////////////////

export class ThirdpartyApiCredentialsMapper {

    static toDto = (creds: ThirdpartyApiCredentials): ThirdpartyApiCredentialsDto => {
        if (creds == null){
            return null;
        }

        const dto: ThirdpartyApiCredentialsDto = {
            id        : creds.id,
            UserId    : creds.UserId,
            Provider  : creds.Provider,
            BaseUrl   : creds.BaseUrl,
            Token     : creds.Token,
            ValidTill : creds.ValidTill,
        };
        return dto;
    };

}
