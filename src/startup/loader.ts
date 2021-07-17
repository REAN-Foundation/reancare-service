import 'reflect-metadata';
import { container, DependencyContainer } from 'tsyringe';

import { DatabaseConnector } from '../data/database/database.connector';
import { Authenticator } from '../auth/authenticator';
import { Authorizer } from '../auth/authorizer';
import { Injector } from './injector';
import { Seeder } from './seeder';
import { StorageService } from '../modules/ehr/services/storage.service';

//////////////////////////////////////////////////////////////////////////////////////////////////
//Register injections here...
Injector.registerInjections(container);
//////////////////////////////////////////////////////////////////////////////////////////////////

export class Loader {

    private static _authorizer: Authorizer = null;
    private static _authenticator: Authenticator = null;
    private static _databaseConnector: DatabaseConnector = null;
    private static _seeder: Seeder = null;
    private static _ehrStore: StorageService = null;
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

    public static get seeder() {
        return Loader._seeder;
    }

    public static get storage() {
        return Loader._ehrStore;
    }

    public static get container() {
        return Loader._container;
    }

    public static init = async () => {
        return new Promise(async (resolve, reject) => {
            try {

                Loader._databaseConnector = container.resolve(DatabaseConnector);
                Loader._authenticator = container.resolve(Authenticator);
                Loader._authorizer = container.resolve(Authorizer);
                Loader._seeder = container.resolve(Seeder);
                
                if(process.env.USE_FHIR_STORAGE == 'Yes') {
                    Loader._ehrStore = container.resolve(StorageService);
                    await Loader._ehrStore.init();
                }

                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    };
}

