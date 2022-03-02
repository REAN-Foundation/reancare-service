import { IFormsService } from "../../interfaces/forms.service.interface";
import needle = require('needle');
import { Logger } from "../../../../common/logger";
import { ThirdpartyApiCredentialsDomainModel } from "../../../../domain.types/thirdparty/thirdparty.api.credentials";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class KoboToolboxService  implements IFormsService {

    //#region Publics

    providerName = (): string => {
        return "KoboToolbox";
    }

    connect = async (connectionModel: ThirdpartyApiCredentialsDomainModel) => {

        var headers = {
            'Content-Type'    : 'application/json',
            Accept            : '*/*',
            'Cache-Control'   : 'no-cache',
            'Accept-Encoding' : 'gzip, deflate, br',
            Connection        : 'keep-alive',
            Authorization     : `Token ${connectionModel.Token}`
        };

        var options = {
            headers    : headers,
            compressed : true,
        };

        var url = connectionModel.SecondaryUrl + 'v2/assets.json';

        var response = await needle('get', url, options);
        if (response.statusCode === 200) {
            const assetCount = response.body.count;
            Logger.instance().log(`Available Kobo assets for this account: ${assetCount}`);
            Logger.instance().log('Successfully connected to AHA API service!');
            return true;
        } else {
            Logger.instance().error('Unable to connect AHA API service!', response.statusCode, null);
            return false;
        }

    }

    //#endregion

}
