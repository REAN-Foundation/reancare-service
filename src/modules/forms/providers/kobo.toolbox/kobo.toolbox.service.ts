import { IFormsService } from "../../interfaces/forms.service.interface";
import needle = require('needle');
import { Logger } from "../../../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class KoboToolboxService  implements IFormsService {

    //#region Publics

    providerName = (): string => {
        return "KoboToolbox";
    }

    connect = async (baseUrl: string, token: string) => {

        var headers = {
            'Content-Type'    : 'application/x-www-form-urlencoded',
            Accept            : '*/*',
            'Cache-Control'   : 'no-cache',
            'Accept-Encoding' : 'gzip, deflate, br',
            Connection        : 'keep-alive',
        };

        var options = {
            headers    : headers,
            compressed : true,
            json       : false,
        };

        var url = baseUrl + '/token';

        var body = {
            client_id     : process.env.AHA_CONTINUITY_CLIENT_ID,
            client_secret : process.env.AHA_CONTINUITY_CLIENT_SECRET,
            grant_type    : 'client_credentials',
        };

        var response = await needle('post', url, body, options);
        if (response.statusCode === 200) {
            //AhaCache.SetWebToken(response.body.access_token, response.body.expires_in);
            Logger.instance().log('Successfully connected to AHA API service!');
            return true;
        } else {
            Logger.instance().error('Unable to connect AHA API service!', response.statusCode, null);
            return false;
        }

    }

    //#endregion

}
