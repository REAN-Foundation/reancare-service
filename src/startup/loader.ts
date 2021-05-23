import 'reflect-metadata';
import { container } from 'tsyringe';

import { IAuthenticator } from "../interfaces/authenticator.interface";
import { IAuthorizer } from '../interfaces/authorizer.interface';
import { IDatabaseConnector } from "../interfaces/database.connector.interface";

import { DatabaseConnector_Sequelize } from "../database/sequelize/database.connector.sequelize";
import { DatabaseConnector } from '../database/database.connector';

import { Authenticator_jwt } from "../auth/jwt/authenticator.jwt";
import { Authenticator } from '../auth/authenticator';
import { Authorizer_custom } from "../auth/custom/authorizer.custom";
import { Authorizer } from '../auth/authorizer';

//////////////////////////////////////////////////////////////////////////////////////////////////

export class Loader {

    private static _instance: Loader = null;

    private static _authorizer: Authorizer = null;
    private static _authenticator: Authenticator = null;
    private static _databaseConnector: DatabaseConnector = null;

    private constructor() {
    }

    public static instance() {
        return this._instance || (this._instance = new this());
    }

    public static get authenticator() {
        return Loader._authenticator;
    }
    
    public static get authorizer() {
        return Loader._authorizer;
    }

    public static get databaseConnector() {
        return Loader._databaseConnector;
    }

    public init = async () => {
        return new Promise((resolve, reject) => {
            try {

                //Register database service
                container.register('IDatabaseConnector', DatabaseConnector_Sequelize);
                const databaseConnector = container.resolve(DatabaseConnector);

                //Register authenticator
                container.register('IAuthenticator', Authenticator_jwt);
                const authenticator = container.resolve(Authenticator);

                //Register authorizer
                container.register('IAuthorizer', Authorizer_custom);
                const authorizer = container.resolve(Authorizer);

                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    };
}
