import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserService } from '../../services/users/user/user.service';
import { Logger } from '../../common/logger';
import { AuthenticationResult } from '../../domain.types/auth/auth.domain.types';
import { CurrentClient } from '../../domain.types/miscellaneous/current.client';
import { ApiClientService } from '../../services/api.client/api.client.service';
import { Loader } from '../../startup/loader';
import { IAuthenticator } from '../authenticator.interface';
import { CurrentUser } from '../../domain.types/miscellaneous/current.user';

//////////////////////////////////////////////////////////////

export class CustomAuthenticator implements IAuthenticator {

    _clientService: ApiClientService = null;

    _userService: UserService = null;

    constructor() {
        this._clientService = Loader.container.resolve(ApiClientService);
        this._userService = Loader.container.resolve(UserService);
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

            if (token == null || token === 'null') {
                const IsPrivileged = request.currentClient.IsPrivileged as boolean;
                if (IsPrivileged) {
                    return res;
                }

                res = {
                    Result        : false,
                    Message       : 'Unauthorized user access',
                    HttpErrorCode : 401,
                };
                return res;
            }

            // synchronous verification
            var user = jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET) as JwtPayload;
            var sessionId = user.SessionId ?? null;
            if (!sessionId) {
                const IsPrivilegedUser = request.currentClient.IsPrivileged as boolean;
                if (IsPrivilegedUser) {
                    request.currentUser = user as CurrentUser;
                    return res;
                }
                res = {
                    Result        : false,
                    Message       : 'Your session has expired. Please login to the app again.',
                    HttpErrorCode : 403,
                };

                return res;
            }

            var isValidUserLoginSession = await this._userService.isValidUserLoginSession(sessionId);

            if (!isValidUserLoginSession) {
                res = {
                    Result        : false,
                    Message       : 'Invalid or expired user login session.',
                    HttpErrorCode : 403,
                };

                return res;
            }

            request.currentUser = user as CurrentUser;
            res = {
                Result        : true,
                Message       : 'Authenticated',
                HttpErrorCode : 200,
            };

            return res;
        } catch (err) {
            Logger.instance().log(JSON.stringify(err, null, 2));
            res = {
                Result        : false,
                Message       : 'Forbidden user access',
                HttpErrorCode : 403,
            };
            return res;
        }
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
