import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { CustomUserAuthorizer } from './custom/custom.user.authorizer';
import { CustomUserAuthenticator } from './custom/custom.user.authenticator';

////////////////////////////////////////////////////////////////////////////////

export class AuthInjector {

    static registerInjections(container: DependencyContainer) {
        container.register('IUserAuthenticator', CustomUserAuthenticator);
        container.register('IUserAuthorizer', CustomUserAuthorizer);
    }

}
