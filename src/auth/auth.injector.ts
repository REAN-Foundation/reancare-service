import 'reflect-metadata';
import { ConfigurationManager } from '../config/configuration.manager';
import { DependencyContainer } from 'tsyringe';
import { CustomAuthenticator } from './custom/custom.authenticator';
import { CustomAuthorizer } from './custom/custom.authorizer';

////////////////////////////////////////////////////////////////////////////////

export class AuthInjector {

    static registerInjections(container: DependencyContainer) {
        
        const authentication = ConfigurationManager.Authentication();
        const authorization = ConfigurationManager.Authorization();

        if (authentication === 'Custom') {
            container.register('IAuthenticator', CustomAuthenticator);
        }
        if (authorization === 'Custom') {
            container.register('IAuthorizer', CustomAuthorizer);
        }

    }

}
