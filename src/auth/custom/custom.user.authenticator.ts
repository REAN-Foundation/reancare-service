import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Logger } from '../../common/logger';
import { IUserAuthenticator } from '../interfaces/user.authenticator.interface';
import { AuthenticationResult } from '../../domain.types/auth/auth.domain.types';
import { CurrentUser } from '../../domain.types/miscellaneous/current.user';
import { ConfigurationManager } from '../../config/configuration.manager';
import { UserService } from '../../services/users/user/user.service';
import { TenantService } from '../../services/tenant/tenant.service';
import { Injector } from '../../startup/injector';

/////////////////////////////////////////////////////////////////////////////////

export class CustomUserAuthenticator implements IUserAuthenticator {

    _userService: UserService = null;

    _tenantService: TenantService = null;

    constructor() {
        this._userService = Injector.Container.resolve(UserService);
        this._tenantService = Injector.Container.resolve(TenantService);
        this._userService = Injector.Container.resolve(UserService);
    }

    public authenticate = async (
        request: express.Request
    ): Promise<AuthenticationResult> => {
        try {
            if (request.clientAppRoutes) {
                //This check is applicable only for the client app
                //specific endpoints. For all other endpoints, this
                //check is not applicable.
                return {
                    Result        : true,
                    Message       : 'Authenticated',
                    HttpErrorCode : 200,
                };
            }
            var res: AuthenticationResult = {
                Result        : true,
                Message       : 'Authenticated',
                HttpErrorCode : 200,
            };

            const authHeader = request.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            const missingToken = token == null || token === 'null' || token === undefined;
            const allowAnonymous = request.allowAnonymous;

            if ( missingToken && !allowAnonymous) {
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
            request.currentUserTenantId = request.currentUser?.TenantId;
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

    public rotateUserSessionToken = async (refreshToken: string): Promise<string> => {
        if (!refreshToken) {
            throw ('Invalid refresh token');
        }
        const payload = jwt.verify(refreshToken, process.env.USER_REFRESH_TOKEN_SECRET) as JwtPayload;
        const userId = payload.userId;
        const sessionId = payload.sessionId;
        const tenantId = payload.tenantId;
        var isValidUserLoginSession = await this._userService.isValidUserLoginSession(sessionId);
        if (!isValidUserLoginSession) {
            throw ('Invalid or expired user login session.');
        }
        const user = await this._userService.getById(userId);
        if (!user) {
            throw ('Invalid user');
        }
        const tenant = await this._tenantService.getById(tenantId);
        var currentUser: CurrentUser = {
            UserId        : user.id,
            TenantId      : tenant.id,
            TenantCode    : tenant.Code,
            TenantName    : tenant.Name,
            DisplayName   : user.Person.DisplayName,
            Phone         : user.Person.Phone,
            Email         : user.Person.Email,
            UserName      : user.UserName,
            CurrentRoleId : user.RoleId,
            CurrentRole   : user.Role.RoleName,
            SessionId     : sessionId
        };
        const accessToken = await this.generateUserSessionToken(currentUser);
        return accessToken;
    };

    public generateRefreshToken = async (userId: string, sessionId: string, tenantId: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            try {
                const expiresIn: number = ConfigurationManager.RefreshTokenExpiresInSeconds();
                var seconds = expiresIn.toString() + 's';
                const payload = {
                    userId,
                    sessionId,
                    tenantId
                };
                const token = jwt.sign(payload, process.env.USER_REFRESH_TOKEN_SECRET, { expiresIn: seconds });
                resolve(token);
            } catch (error) {
                reject(error);
            }
        });
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

}
