import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { ConfigurationManager } from '../../config/configuration.manager';
import { SequelizeInjector } from './sequelize/sequelize.injector';

////////////////////////////////////////////////////////////////////////////////

export class SQLInjector
{

    static registerInjections(container: DependencyContainer) {

        const databaseORM = ConfigurationManager.DatabaseORM();
        if (databaseORM === 'Sequelize') {
            SequelizeInjector.registerInjections(container);
        }

    }

}
