import "reflect-metadata"

import express = require('express');
import bodyParser = require("body-parser");
import fileUpload = require('express-fileupload');
import cors = require('cors');
import helmet = require('helmet');

import { Router } from './startup/router';
import { Loader } from './startup/loader';
import { Seeder } from './startup/seeder';
import { DbConnector } from './startup/db.connector';
import { Scheduler } from './startup/scheduler';

import { Logger } from './common/logger';

/////////////////////////////////////////////////////////////////////////

export default class Application {

    public _app:any = null;
    private _router: Router = null;
    private static _instance: Application = null;

    private constructor() {
        this._app = express();
        this._router = new Router(this._app);
    }

    public static instance() {
        return this._instance || (this._instance = new this());
    }
    
    public start = async() => {
        try{
            //Load the modules
            var loader = Loader.instance();
            await loader.init();

            //Connect with database
            await DbConnector.instance().init();

            //Set-up middlewares
            this.setupMiddlewares();

            //Set the routes
            await this._router.init();

            //Seed the service
            await Seeder.instance().init();

            //Set-up cron jobs


            //Start listening
            await this.listen();
            
        }
        catch(error){
            Logger.instance().log('An error occurred while starting reancare-api service.');
        }
    }


    private setupMiddlewares = () => {

        return new Promise((resolve, reject) => {
            try {
                this._app.use(bodyParser.json());
                this._app.use(bodyParser.urlencoded({ extended: true }));
                this._app.use(express.json());
                this._app.use(helmet());
                this._app.use(cors());
            
                this._app.use(fileUpload({
                    limits: { fileSize: 100 * 1024 * 1024 },
                    preserveExtension: true,
                    createParentPath: true,
                    parseNested: true,
                    useTempFiles: true,
                    tempFileDir: '/tmp/uploads/'
                }));
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        });
    }

    private listen = () => {
        return new Promise((resolve, reject) => {
            try {
                const port = process.env.PORT;
                var server = this._app.listen(port, () => {
                    var serviceName = 'REANCare api' + '-' + process.env.NODE_ENV;
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
    }

}
