import { injectable } from "tsyringe";
import needle = require('needle');
//////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AwsLambdaService {

    //#region Publics

    // public init = async (): Promise<boolean> => {

    //     var headers = {
    //         'Content-Type'    : 'application/x-www-form-urlencoded',
    //         Accept            : '*/*',
    //         'Cache-Control'   : 'no-cache',
    //         'Accept-Encoding' : 'gzip, deflate, br',
    //         Connection        : 'keep-alive',
    //     };

    //     var options = {
    //         headers    : headers,
    //         compressed : true,
    //         json       : false,
    //     };

    //     var url = process.env.AHA_API_BASE_URL + '/token';

    //     var body = {
    //         client_id     : process.env.AHA_API_CLIENT_ID,
    //         client_secret : process.env.AHA_API_CLIENT_SECRET,
    //         grant_type    : 'client_credentials',
    //     };

    //     var response = await needle('post', url, body, options);
    //     if (response.statusCode === 200) {
    //         AhaCache.SetWebToken(response.body.access_token, response.body.expires_in);
    //         Logger.instance().log('Successfully connected to AHA API service!');
    //         return true;
    //     } else {
    //         Logger.instance().error('Unable to connect AHA API service!', response.statusCode, null);
    //         return false;
    //     }

    // };

    createBotSchema = async (schemaName: string, environment: string): Promise<void> => {
        const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;
        const url = `${AHA_API_BASE_URL}/botSchemas`;
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

        const body = {
            schemaName  : schemaName,
            environment : environment,
        };

        const response = await needle('post', url, body, options);
    };

    //#endregion

}
