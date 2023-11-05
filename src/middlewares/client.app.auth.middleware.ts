import express from "express";
import { AuthenticationResult } from "../domain.types/auth/auth.domain.types";
import { CurrentClient } from "../domain.types/miscellaneous/current.client";
import { Injector } from "../startup/injector";
import { ClientAppService } from "../services/client.apps/client.app.service";
import { ResponseHandler } from "../common/handlers/response.handler";
import { Logger } from "../common/logger";

/////////////////////////////////////////////////////////////////////////////

export default class ClientAppAuthMiddleware
{

    public static authenticateClient = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<boolean> => {
        try {
            const requestUrl = request.originalUrl;
            const isHealthCheck = requestUrl === '/api/v1' && request.method === 'GET';
            if (!isHealthCheck) {
                const authResult = await this.authenticate(request);
                if (authResult.Result === false){
                    ResponseHandler.failure(request, response, authResult.Message, authResult.HttpErrorCode);
                    return false;
                }
                next();
            }
            else {
                next();
            }
        } catch (error) {
            Logger.instance().log(error.message);
            ResponseHandler.failure(request, response, 'Client authentication error: ' + error.message, 401);
        }
    };

    private static authenticate = async (request: express.Request): Promise<AuthenticationResult> => {
        try {
            var res: AuthenticationResult = {
                Result        : true,
                Message       : 'Authenticated',
                HttpErrorCode : 200,
            };
            let apiKey: string = request.headers['x-api-key'] as string;

            if (!apiKey) {
                res = {
                    Result        : false,
                    Message       : 'Missing API key for the client',
                    HttpErrorCode : 401,
                };
                return res;
            }
            apiKey = apiKey.trim();

            const clientService = Injector.Container.resolve(ClientAppService);
            const client: CurrentClient = await clientService.isApiKeyValid(apiKey);
            if (!client) {
                res = {
                    Result        : false,
                    Message       : 'Invalid API Key: Forbidden access',
                    HttpErrorCode : 403,
                };
                return res;
            }
            request.currentClient = client;

        } catch (err) {
            Logger.instance().log(JSON.stringify(err, null, 2));
            res = {
                Result        : false,
                Message       : 'Error authenticating client',
                HttpErrorCode : 401,
            };
        }
        return res;
    };

}

