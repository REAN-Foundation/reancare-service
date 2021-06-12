import 'reflect-metadata';
import { container } from 'tsyringe';

import { DatabaseConnector_Sequelize } from "../data/dal/sequelize/database.connector.sequelize";
import { DatabaseConnector } from '../data/database.connector';
import { Authenticator_jwt } from "../auth/jwt/authenticator.jwt";
import { Authenticator } from '../auth/authenticator';
import { Authorizer_custom } from "../auth/custom/authorizer.custom";
import { Authorizer } from '../auth/authorizer';

//////////////////////////////////////////////////////////////////////////////////////////////////

export class Loader {

    private static _authorizer: Authorizer = null;
    private static _authenticator: Authenticator = null;
    private static _databaseConnector: DatabaseConnector = null;

    public static get authenticator() {
        return Loader._authenticator;
    }
    
    public static get authorizer() {
        return Loader._authorizer;
    }

    public static get databaseConnector() {
        return Loader._databaseConnector;
    }

    public static init = async () => {
        return new Promise((resolve, reject) => {
            try {

                //Register database service
                container.register('IDatabaseConnector', DatabaseConnector_Sequelize);
                Loader._databaseConnector = container.resolve(DatabaseConnector);

                //Register authenticator
                container.register('IAuthenticator', Authenticator_jwt);
                Loader._authenticator = container.resolve(Authenticator);

                //Register authorizer
                container.register('IAuthorizer', Authorizer_custom);
                Loader._authorizer = container.resolve(Authorizer);

                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    };
}
