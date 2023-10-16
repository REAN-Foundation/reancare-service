import { DatabaseDialect } from "../../domain.types/miscellaneous/system.types";
import * as dotenv from 'dotenv';
import { Logger } from "../../common/logger";
import { ConfigurationManager } from "../../config/configuration.manager";

/////////////////////////////////////////////////////////////////////////////

export enum DatabaseSchemaType {
    Primary = 'Primary',
    EHRInsights = 'EHRInsights',
    AwardsFacts = 'AwardsFacts'
}

export interface DatabaseConfiguration {
    Dialect         : DatabaseDialect;
    DatabaseName    : string;
    Host            : string;
    Port            : number;
    Username        : string;
    Password        : string;
    ConnectionString: string;
    Pool            : {
        Max    : number,
        Min    : number,
        Acquire: number,
        Idle   : number,
    },
    Cache      : boolean;
    Synchronize: boolean;
    Logging    : boolean;
}

export const databaseConfig = (schemaType: DatabaseSchemaType)
    : DatabaseConfiguration => {

    const dialect = process.env.DB_DIALECT as DatabaseDialect;
    const config: DatabaseConfiguration = {
        Dialect          : dialect,
        DatabaseName     : process.env.DB_NAME,
        Host             : process.env.DB_HOST,
        Port             : parseInt(process.env.DB_PORT),
        Username         : process.env.DB_USER_NAME,
        Password         : process.env.DB_USER_PASSWORD,
        ConnectionString : process.env.CONNECTION_STRING ?? null,
        Pool             : {
            Max     : 20,
            Min     : 0,
            Acquire : 30000,
            Idle    : 10000,
        },
        Cache       : true,
        Logging     : true,
        Synchronize : true
    };

    if (schemaType === DatabaseSchemaType.EHRInsights &&
        ConfigurationManager.EHRAnalyticsEnabled()) {
        config.DatabaseName = process.env.DB_NAME_EHR_INSIGHTS;
    }
    else if (schemaType === DatabaseSchemaType.AwardsFacts &&
        ConfigurationManager.GamificationEnabled()) {
        config.DatabaseName = process.env.DB_NAME_AWARDS_FACTS;
    }

    return config;
};

//////////////////////////////////////////////////////////////////////////////////

if (typeof process.env.NODE_ENV === 'undefined') {
    dotenv.config();
}

Logger.instance().log('================================================');
Logger.instance().log('Environment                : ' + process.env.NODE_ENV);
Logger.instance().log('Database dialect           : ' + process.env.DB_DIALECT);
Logger.instance().log('Database host              : ' + process.env.DB_HOST);
Logger.instance().log('Database port              : ' + process.env.DB_PORT);
Logger.instance().log('Database user-name         : ' + process.env.DB_USER_NAME);
Logger.instance().log('Primary database name      : ' + process.env.DB_NAME);

if (ConfigurationManager.EHRAnalyticsEnabled()) {
    Logger.instance().log('EHR insights database name : ' + process.env.DB_NAME_EHR_INSIGHTS);
}
if (ConfigurationManager.GamificationEnabled()) {
    Logger.instance().log('Awards facts database name : ' + process.env.DB_NAME_AWARDS_FACTS);
}

Logger.instance().log('================================================');

//////////////////////////////////////////////////////////////////////////////////

