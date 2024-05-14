import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import "reflect-metadata";
import { Router } from './api/router';
import { Helper } from './common/helper';
import { Logger } from './common/logger';
import { ConfigurationManager } from "./config/configuration.manager";
import { EHRDbConnector } from './modules/ehr.analytics/ehr.db.connector';
import { AwardsFactsDBConnector } from './modules/awards.facts/awards.facts.db.connector';
import { PrimaryDatabaseConnector } from './database/database.connector';
import { Loader } from './startup/loader';
import { AwardsFactsService } from './modules/awards.facts/awards.facts.service';
import { DatabaseClient } from './common/database.utils/dialect.clients/database.client';
import { DatabaseSchemaType } from './common/database.utils/database.config';
import { Injector } from './startup/injector';
import { errorHandlerMiddleware } from './middlewares/error.handling.middleware';

/////////////////////////////////////////////////////////////////////////

export default class Application {

    public _app: express.Application = null;

    private _router: Router = null;

    private static _instance: Application = null;

    private constructor() {
        this._app = express();
        this._router = new Router(this._app);
    }

    public static instance(): Application {
        return this._instance || (this._instance = new this());
    }

    public app(): express.Application {
        return this._app;
    }

    public start = async(): Promise<void> => {
        try {

            //Load configurations
            ConfigurationManager.loadConfigurations();

            //Load the modules
            await Loader.init();

            //Connect databases
            await connectDatabase_Primary();

            if (ConfigurationManager.EHRAnalyticsEnabled()) {
                await connectDatabase_EHRInsights();
            }
            if (ConfigurationManager.GamificationEnabled()) {
                await connectDatabase_AwardsFacts();
            }

            //Set-up middlewares
            await this.setupMiddlewares();

            //Set the routes
            await this._router.init();

            //Seed the service
            await Loader.seeder.init();

            if (process.env.NODE_ENV !== 'test') {
                //Set-up cron jobs
                await Loader.scheduler.schedule();
            }

            this._app.use(errorHandlerMiddleware);

            //Handle unhandled rejections
            process.on('unhandledRejection', (reason, promise) => {
                Logger.instance().log('Unhandled Rejection!');
                promise.catch(error => {
                    Logger.instance().log(`Unhandled Rejection at: ${error.message}`);
                });
            });

            process.on('exit', code => {
                Logger.instance().log(`Process exited with code: ${code}`);
            });

            //Start listening
            await this.listen();

        }
        catch (error){
            Logger.instance().log('An error occurred while starting reancare-api service.' + error.message);
        }
    };

    private setupMiddlewares = async (): Promise<boolean> => {

        return new Promise((resolve, reject) => {
            try {
                this._app.use(express.urlencoded({ limit: '50mb', extended: true }));
                this._app.use(express.json( { limit: '50mb' }));
                this._app.use(helmet());
                this._app.use(cors());

                //TODO: Move this to upload specific routes. Use router.use() method
                // this.useFileUploadMiddleware();
                
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        });
    };

    private listen = () => {
        return new Promise((resolve, reject) => {
            try {
                const port = process.env.PORT;
                const server = this._app.listen(port, () => {
                    const serviceName = 'REANCare api' + '-' + process.env.NODE_ENV;
                    const osType = Helper.getOSType();
                    Logger.instance().log(`Operating system: ${osType}`);
                    Logger.instance().log(serviceName + ' is up and listening on port ' + process.env.PORT.toString());
                    this._app.emit("server_started");
                });
                module.exports.server = server;
                resolve(this._app);
            }
            catch (error) {
                reject(error);
            }
        });
    };

}

async function connectDatabase_Primary() {
    if (process.env.NODE_ENV === 'test') {
        const databaseClient = Injector.Container.resolve(DatabaseClient);
        await databaseClient.dropDb(DatabaseSchemaType.Primary);
    }
    const primaryDatabaseConnector = Injector.Container.resolve(PrimaryDatabaseConnector);
    await primaryDatabaseConnector.init();
}

async function connectDatabase_EHRInsights() {
    //Connect with EHR insights database
    await EHRDbConnector.connect();
}

async function connectDatabase_AwardsFacts() {
    //Connect with Awards facts database
    await AwardsFactsDBConnector.connect();
    //Fetch the event types from awards service
    await AwardsFactsService.initialize();
}
