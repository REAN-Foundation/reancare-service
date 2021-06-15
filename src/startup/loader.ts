import 'reflect-metadata';
import { container, DependencyContainer } from 'tsyringe';

import { DatabaseConnector } from '../data/database/database.connector';
import { Authenticator } from '../auth/authenticator';
import { Authorizer } from '../auth/authorizer';
import { Injector } from './injector';

//////////////////////////////////////////////////////////////////////////////////////////////////

export class Loader {

    private static _authorizer: Authorizer = null;
    private static _authenticator: Authenticator = null;
    private static _databaseConnector: DatabaseConnector = null;
    private static _container: DependencyContainer = container;

    public static get authenticator() {
        return Loader._authenticator;
    }
    
    public static get authorizer() {
        return Loader._authorizer;
    }

    public static get databaseConnector() {
        return Loader._databaseConnector;
    }

    public static get container() {
        return Loader._container;
    }

    public static init = async () => {
        return new Promise((resolve, reject) => {
            try {

                Injector.registerInjections(container);

                Loader._databaseConnector = container.resolve(DatabaseConnector);
                Loader._authenticator = container.resolve(Authenticator);
                Loader._authorizer = container.resolve(Authorizer);

                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    };
}

