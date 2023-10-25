import { Request, Response, NextFunction } from 'express';
import { UserAuthorizer } from './wrappers/user.authorizer';
import { UserAuthenticator } from './wrappers/user.authenticator';
import { Injector } from '../startup/injector';
import { ResponseHandler } from '../common/handlers/response.handler';
import { ErrorHandler } from '../common/handlers/error.handler';
import { uuid } from '../domain.types/miscellaneous/system.types';
import { RequestType } from '../domain.types/miscellaneous/current.user';

////////////////////////////////////////////////////////////////////////
export type AuthMiddleware =
    (request: Request, response: Response, next: NextFunction)
    => Promise<void>;
////////////////////////////////////////////////////////////////////////

export class AuthHandler {

    public static handle = (context:string, allowAnonymous = false): AuthMiddleware[] => {

        var middlewares: AuthMiddleware[] = [];

        //Set context
        var contextSetter = async (request: Request, response: Response, next: NextFunction) => {
            request.context = context;
            const tokens = context.split('.');
            if (tokens.length < 2) {
                ResponseHandler.failure(request, response, 'Invalid request context', 400);
                return;
            }
            request.context = context;
            request.currentUserTenantId = request.currentUser.TenantId;
            request.resourceType = this.getResourceType(context);
            request.requestType = this.getRequestType(context, request);
            request.resourceId = this.getResourceId(request);
            request.resourceOwnerUserId = this.getResourceOwner(request);

            next();
        };
        middlewares.push(contextSetter);

        if (allowAnonymous) {
            return middlewares;
        }

        //Line-up the auth middleware chain

        var userAuthenticator = Injector.Container.resolve(UserAuthenticator);
        middlewares.push(userAuthenticator.authenticate);

        var authorizer = Injector.Container.resolve(UserAuthorizer);
        middlewares.push(authorizer.authorize);

        return middlewares;
    };

    public static verifyAccess = async(request: Request): Promise<boolean> => {

        var userAuthenticator = Injector.Container.resolve(UserAuthenticator);
        const userVerified = await userAuthenticator.verify(request);
        if (userVerified === false){
            ErrorHandler.throwUnauthorizedUserError('Unauthorized access');
        }

        var userAuthorizer = Injector.Container.resolve(UserAuthorizer);
        const authorized = await userAuthorizer.verify(request);
        if (authorized === false){
            ErrorHandler.throwForebiddenAccessError('Unauthorized access');
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

    private static getResourceType = (context: string): string => {

        const tokens = context.split('.');
        var tokens_ = tokens.slice(0, tokens.length - 1);
        const resourceType = tokens_.join('.');

        return resourceType;
    };

    private static getRequestType = (context: string, request): RequestType | null | undefined => {
        const ctx = context.toLowerCase();
        if (ctx.includes('.search')) {
            return 'Search';
        }
        if (ctx.includes('.create')) {
            return 'Create';
        }
        if (ctx.includes('.delete')) {
            return 'Delete';
        }
        if (ctx.includes('.update')) {
            return 'Update';
        }
        if (ctx.includes('.getbyid')) {
            return 'GetById';
        }
        if (ctx.includes('.get')) {
            return 'Get';
        }
        if (request.method === 'POST') {
            return 'Create';
        }
        if (request.method === 'PUT') {
            return 'Update';
        }
        if (request.method === 'DELETE') {
            return 'Delete';
        }
        if (request.method === 'GET') {
            return 'Get';
        }
        return 'Other';
    };

    private static getResourceId = (request: Request): string | number | null | undefined => {
        var resourceId = null;
        if (request.params.id != null && request.params.id !== 'undefined') {
            if (request.requestType === 'GetById' ||
                request.requestType === 'Update' ||
                request.requestType === 'Delete') {
                resourceId = request.params.id;
                return resourceId;
            }
        }
        return resourceId;
    };

    private static getResourceOwner = (request: Request): string => {
        var resourceOwnerUserId = null;
        if (request.requestType === 'Create') {
            //By default, any resource associated with patient is owned by the patient
            //This includes clinical entities, wellness entities, etc.
            if (request.body.PatientUserId != null || request.body.PatientUserId !== 'undefined') {
                resourceOwnerUserId = request.body.PatientUserId;
                return resourceOwnerUserId;
            }
            //By default, any resource associated with user is owned by the user
            if (request.body.UserId != null || request.body.UserId !== 'undefined') {
                resourceOwnerUserId = request.body.UserId;
                return resourceOwnerUserId;
            }
        }
        return resourceOwnerUserId;
    };

}

export const auth = AuthHandler.handle;
