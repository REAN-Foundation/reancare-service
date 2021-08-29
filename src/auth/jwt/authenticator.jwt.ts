import express from 'express';
import jwt from 'jsonwebtoken';

import { Logger } from '../../common/logger';
import { IAuthenticator } from '../authenticator.interface';
import { ApiClientService } from '../../services/api.client.service';
import { Loader } from '../../startup/loader';
import { CurrentClient } from '../../domain.types/miscellaneous/current.client';
import { AuthenticationResult } from '../../domain.types/auth/auth.domain.types';

//////////////////////////////////////////////////////////////

export class Authenticator_jwt implements IAuthenticator {

    _clientService: ApiClientService = null;

    constructor() {
        this._clientService = Loader.container.resolve(ApiClientService);
    }

    public authenticateUser = async (
        request: express.Request
    ): Promise<AuthenticationResult> => {
        try {
            var res: AuthenticationResult = {
                Result        : true,
                Message       : 'Authenticated',
                HttpErrorCode : 200,
            };

            const authHeader = request.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (token == null) {
                res = {
                    Result        : false,
                    Message       : 'Unauthorized user access',
                    HttpErrorCode : 401,
                };
                return res;
            }

            jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET, (error, user) => {
                if (error) {
                    res = {
                        Result        : false,
                        Message       : 'Forebidden user access',
                        HttpErrorCode : 403,
                    };
                    return res;
                }
                request.currentUser = user;
            });
        } catch (err) {
            Logger.instance().log(JSON.stringify(err, null, 2));
            res = {
                Result        : false,
                Message       : 'Error authenticating user',
                HttpErrorCode : 401,
            };
        }
        return res;
    };

    public authenticateClient = async (request: express.Request): Promise<AuthenticationResult> => {
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

            const client: CurrentClient = await this._clientService.isApiKeyValid(apiKey);
            if (!client) {
                res = {
                    Result        : false,
                    Message       : 'Invalid API Key: Forebidden access',
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
