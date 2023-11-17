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
import { ConfigurationManager } from '../../config/configuration.manager';
//import Terra  from 'terra-api';

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
            Logger.instance().log(err.message);
            res = {
                Result        : false,
                Message       : 'Forbidden user access: ' + err.message, // Please do not change this and if needed to change then check with app developer
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

    public generateUserSessionToken = async (user: CurrentUser): Promise<string> => {
        return new Promise((resolve, reject) => {
            try {
                const expiresIn: number = ConfigurationManager.AccessTokenExpiresInSeconds();
                var seconds = expiresIn.toString() + 's';
                const token = jwt.sign(user, process.env.USER_ACCESS_TOKEN_SECRET, { expiresIn: seconds });
                resolve(token);
            } catch (error) {
                reject(error);
            }
        });
    };

    public rotateUserSessionToken = async (refreshToken: string): Promise<string> => {
        if (!refreshToken) {
            throw ('Invalid refresh token');
        }
        const payload = jwt.verify(refreshToken, process.env.USER_REFRESH_TOKEN_SECRET) as JwtPayload;
        const userId = payload.userId;
        const sessionId = payload.sessionId;
        var isValidUserLoginSession = await this._userService.isValidUserLoginSession(sessionId);
        if (!isValidUserLoginSession) {
            throw ('Invalid or expired user login session.');
        }
        const user = await this._userService.getById(userId);
        if (!user) {
            throw ('Invalid user');
        }
        var currentUser: CurrentUser = {
            UserId        : user.id,
            DisplayName   : user.Person.DisplayName,
            Phone         : user.Person.Phone,
            Email         : user.Person.Email,
            UserName      : user.UserName,
            CurrentRoleId : user.RoleId,
            SessionId     : sessionId
        };
        const accessToken = await this.generateUserSessionToken(currentUser);
        return accessToken;
    };

    public generateRefreshToken = async (userId: string, sessionId: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            try {
                const expiresIn: number = ConfigurationManager.RefreshTokenExpiresInSeconds();
                var seconds = expiresIn.toString() + 's';
                const payload = {
                    userId,
                    sessionId
                };
                const token = jwt.sign(payload, process.env.USER_REFRESH_TOKEN_SECRET, { expiresIn: seconds });
                resolve(token);
            } catch (error) {
                reject(error);
            }
        });
    };

    public authenticateTerra = async (request: express.Request): Promise<AuthenticationResult> => {
        try {
            var res: AuthenticationResult = {
                Result        : true,
                Message       : 'Authenticated',
                HttpErrorCode : 200,
            };
            if (!process.env.TERRA_DEV_ID && !process.env.TERRA_API_KEY) {
                res = {
                    Result        : false,
                    Message       : 'Missing API key for the client',
                    HttpErrorCode : 401,
                };
                return res;
            }
            //const terra = new Terra(process.env.TERRA_DEV_ID, process.env.TERRA_API_KEY, process.env.TERRA_SIGNING_SECRET);
            const devId = request.headers['dev-id'];
            //const verified = terra.checkTerraSignature(terraSiganture.toString() , request.body);
            if (!(devId.toString() === process.env.TERRA_DEV_ID)) {
                res = {
                    Result        : false,
                    Message       : 'Invalid Signing Secret: Forbidden access',
                    HttpErrorCode : 403,
                };
                return res;
            }

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
