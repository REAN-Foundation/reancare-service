import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';

import { DatabaseInjector } from "../database/database.injector";
import { ModuleInjector } from '../modules/module.injector';
import { AuthInjector } from '../auth/auth.injector';

//////////////////////////////////////////////////////////////////////////////////////////////////

export class Injector {

    static registerInjections(container: DependencyContainer) {

        //Auth
        AuthInjector.registerInjections(container);

        //Database
        DatabaseInjector.registerInjections(container);

        //Modules
        ModuleInjector.registerInjections(container);

    }

}
