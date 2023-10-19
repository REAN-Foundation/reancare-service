import { Request, Response, NextFunction } from 'express';
import { UserAuthorizer } from './wrappers/user.authorizer';
import { UserAuthenticator } from './wrappers/user.authenticator';
import { Injector } from '../startup/injector';
import { ResponseHandler } from '../common/handlers/response.handler';
import { ErrorHandler } from '../common/handlers/error.handler';

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
            const resourceType = tokens[0];
            request.context = context;
            request.resourceType = resourceType;
            if (request.params.id !== undefined && request.params.id !== null) {
                request.resourceId = request.params.id;
            }
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

}

export const auth = AuthHandler.handle;
