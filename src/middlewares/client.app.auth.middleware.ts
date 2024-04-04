import express from "express";
import { AuthResult } from "../auth/auth.types";
import { CurrentClient } from "../domain.types/miscellaneous/current.client";
import { Injector } from "../startup/injector";
import { ClientAppService } from "../services/client.apps/client.app.service";
import { ResponseHandler } from "../common/handlers/response.handler";
import { Logger } from "../common/logger";
import { ClientAppController } from "../api/client.apps/client.app.controller";

/////////////////////////////////////////////////////////////////////////////

export default class ClientAppAuthMiddleware
{

    public static authenticateClient = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        try {
            const requestUrl = request.originalUrl;

            // Handle certain endpoints separately
            const isHealthCheck = requestUrl === '/api/v1' && request.method === 'GET';
            const currApiKey = requestUrl.includes('/api/v1/api-clients/') && requestUrl.includes('/current-api-key');
            const renewApiKey = requestUrl.includes('/api/v1/api-clients/') && requestUrl.includes('/renew-api-key');

            if (currApiKey || renewApiKey) {
                const clientAppController = new ClientAppController();
                const clientApp = await clientAppController.authenticateClientPassword(request);
                if (clientApp != null) {
                    const currentClient: CurrentClient = {
                        ClientCode   : clientApp.ClientCode,
                        ClientName   : clientApp.ClientName,
                        IsPrivileged : clientApp.IsPrivileged,
                    };
                    request.currentClient = currentClient;
                    next();
                }
                else {
                    ResponseHandler.failure(request, response, 'Invalid client credentials', 401);
                    return;
                }
            }
            else if (isHealthCheck) {
                next();
            }
            else {
                const authResult = await this.authenticate(request);
                if (authResult.Result === false){
                    ResponseHandler.failure(request, response, authResult.Message, authResult.HttpErrorCode);
                    return;
                }
                next();
            }
        } catch (error) {
            Logger.instance().log(error.message);
            ResponseHandler.failure(request, response, 'Client authentication error: ' + error.message, 401);
        }
    };

    private static authenticate = async (request: express.Request): Promise<AuthResult> => {
        try {
            var res: AuthResult = {
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

    // import { FileResourceService } from "../services/general/file.resource.service";
    // const isPublicResourceDownload = await this.isPublicResourceDownloadRequest(request);
    // if (isPublicResourceDownload) {
    //     request.publicUrl = true;
    //     return res;
    // }

    // private static isPublicResourceDownloadRequest = async (request: express.Request): Promise<boolean> => {
    //     const requestUrl = request.originalUrl;
    //     const downloadUrl = requestUrl.includes('/api/v1/file-resources') &&
    //                         requestUrl.includes('/download') && request.method === 'GET';
    //     if (!downloadUrl) {
    //         return false;
    //     }
        
    //     //Check if the download request is for a public resource
    //     const fileResourceService = Injector.Container.resolve(FileResourceService);
    //     if (!fileResourceService) {
    //         return false;
    //     }
    //     // Not sure why request.params.resourceId is not working !!!
    //     // Finding it from Url
    //     let tokens = requestUrl.split('/api/v1/file-resources/');
    //     if (tokens.length < 2) {
    //         return false;
    //     }
    //     tokens = tokens[1].split('/download');
    //     if (tokens.length < 1) {
    //         return false;
    //     }
    //     const resourceId = tokens[0];
    //     if (!resourceId) {
    //         return false;
    //     }
    //     const isPublicResource = await fileResourceService.isPublicResource(resourceId);
    //     return isPublicResource;
    // };

}
