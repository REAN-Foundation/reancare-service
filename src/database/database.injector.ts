import 'reflect-metadata';
import { ConfigurationManager } from '../config/configuration.manager';
import { DependencyContainer } from 'tsyringe';
import { SQLInjector } from './sql/sql.injector';
import { DatabaseClientInjector } from '../common/database.utils/dialect.clients/database.client.injector';

////////////////////////////////////////////////////////////////////////////////

export class DatabaseInjector {

    static registerInjections(container: DependencyContainer) {

        DatabaseClientInjector.registerInjections(container);

        const databaseType = ConfigurationManager.DatabaseType();
        if (databaseType === 'SQL') {
            SQLInjector.registerInjections(container);
        }
        // else if (databaseType === 'NoSQL') {
        //     NoSQLInjector.registerInjections(container);
        // }

    }

}
