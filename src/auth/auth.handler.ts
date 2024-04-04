import { Request, Response, NextFunction } from 'express';
import { UserAuthorizer } from './wrappers/user.authorizer';
import { UserAuthenticator } from './wrappers/user.authenticator';
import { Injector } from '../startup/injector';
import { ResponseHandler } from '../common/handlers/response.handler';
import { ErrorHandler } from '../common/handlers/error.handler';
import { uuid } from '../domain.types/miscellaneous/system.types';
import { ResourceHandler } from './custom/resource.handler';
import { AuthOptions, RequestType, ResourceOwnership, ActionScope } from './auth.types';
import { Client } from 'twilio/lib/base/BaseTwilio';
import ClientAppAuthMiddleware from '../middlewares/client.app.auth.middleware';

////////////////////////////////////////////////////////////////////////
export type AuthMiddleware =
    (request: Request, response: Response, next: NextFunction)
    => Promise<void>;
////////////////////////////////////////////////////////////////////////

export class AuthHandler {

    public static handle = (options: AuthOptions): AuthMiddleware[] => {

        var middlewares: AuthMiddleware[] = [];

        //Set context
        var contextSetter = async (request: Request, response: Response, next: NextFunction) => {
            request.context = options.Context;
            const tokens = options.Context.split('.');
            if (tokens.length < 2) {
                ResponseHandler.failure(request, response, 'Invalid request context', 400);
                return;
            }
            const resourceIdIdentifier = options.ResourceIdName ? options.ResourceIdName.toString() : null;
            request.requestType = options.RequestType;
            request.resourceId = this.getResourceId(request, resourceIdIdentifier);
            request.ownership = options.Ownership;
            request.actionScope = options.Visibility;
            request.clientAppAuth = options.ClientAppAuth != null ? options.ClientAppAuth : false;
            request.controllerAuth = options.ControllerAuth != null ? options.ControllerAuth : false;
            request.customAuthorization = options.CustomAuthorizationFun != null;
            next();
        };
        middlewares.push(contextSetter);

        //Line-up the auth middleware chain
        const controllerAuth = options.ControllerAuth != null ? options.ControllerAuth : false;
        const clientAppAuth = options.ClientAppAuth != null ? options.ClientAppAuth : false;
        const noCustomAuthorization = options.CustomAuthorizationFun == null && controllerAuth === false;
        const systemOwnedResource = options.Ownership === ResourceOwnership.System ||
                                    options.Ownership === ResourceOwnership.NotApplicable;
        const publicAccess = options.Visibility === ActionScope.Public;

        // Client app authentication could be turned off for certain endpoints. e.g. public file downloads, etc.
        if (clientAppAuth === true) {
            middlewares.push(ClientAppAuthMiddleware.authenticateClient);
        }
        else {
            // If client app authentication is turned off and the alternate authentication is in place.
            // For example, get or renew API key, etc.
            const alternateAuth = options.AlternateAuth != null ? options.AlternateAuth : false;
            if (alternateAuth) {
                return middlewares;
            }
        }

        // Perform user authentication
        var userAuthenticator = Injector.Container.resolve(UserAuthenticator);
        middlewares.push(userAuthenticator.authenticate);

        // Open routes that do not require user authorization
        // For example, public resources, system resources, system types, etc.
        if (publicAccess && systemOwnedResource) {
            return middlewares;
        }

        // var resourceHandler = new ResourceHandler();
        // middlewares.push(resourceHandler.extractResourceInfo);

        var authorizer = Injector.Container.resolve(UserAuthorizer);
        middlewares.push(authorizer.authorize);

        return middlewares;
    };

    public static verifyAccess = async(request: Request): Promise<boolean> => {

        var userAuthenticator = Injector.Container.resolve(UserAuthenticator);
        const userVerified = await userAuthenticator.verify(request);
        if (userVerified === false){
            ErrorHandler.throwUnauthorizedUserError('Unauthorized user');
        }

        var userAuthorizer = Injector.Container.resolve(UserAuthorizer);
        const authorized = await userAuthorizer.verify(request);
        if (authorized === false){
            ErrorHandler.throwForebiddenAccessError('Forebidden access');
        }
        return true;
    };

    public static generateUserSessionToken = async (user: any): Promise<string> => {
        var authenticator = Injector.Container.resolve(UserAuthenticator);
        return await authenticator.generateUserSessionToken(user);
    };

    public static generateRefreshToken = async (userId: uuid, sessionId: uuid, tenantId: string): Promise<string> => {
        var authenticator = Injector.Container.resolve(UserAuthenticator);
        return await authenticator.generateRefreshToken(userId, sessionId, tenantId);
    };

    public static rotateUserSessionToken = async (refreshToken: string): Promise<string> => {
        var authenticator = Injector.Container.resolve(UserAuthenticator);
        return await authenticator.rotateUserSessionToken(refreshToken);
    };

    private static getResourceId = (request: Request, resourceIdName?: string): string | number | null | undefined => {
        var resourceId = null;
        if (resourceIdName && 
            request.params[resourceIdName] != null && 
            request.params[resourceIdName] !== 'undefined') {
            resourceId = request.params[resourceIdName];
            return resourceId;
        }
        else if (request.params.id != null && request.params.id !== 'undefined') {
            if (request.requestType === RequestType.GetOne ||
                request.requestType === RequestType.UpdateOne ||
                request.requestType === RequestType.DeleteOne) {
                resourceId = request.params.id;
                return resourceId;
            }
        }
        return resourceId;
    };

}

export const auth = AuthHandler.handle;
