import * as dotenv from 'dotenv';
import { Logger } from "../../../common/logger";

/////////////////////////////////////////////////////////////////////////////

if (typeof process.env.NODE_ENV === 'undefined') {
    dotenv.config();
}

if (process.env.NODE_ENV === 'test') {
    Logger.instance().log('================================================');
    Logger.instance().log('Environment   : ' + process.env.NODE_ENV);
    Logger.instance().log('Database name : ' + process.env.DB_NAME);
    Logger.instance().log('Database user : ' + process.env.DB_USER_NAME);
    Logger.instance().log('Database host : ' + process.env.DB_HOST);
    Logger.instance().log('================================================');
}

export class DbConfig {

    public static config = {
        username : process.env.DB_USER_NAME,
        password : process.env.DB_USER_PASSWORD,
        database : process.env.DB_NAME,
        host     : process.env.DB_HOST,
        dialect  : 'mysql',
        pool     : {
            max     : 20,
            min     : 0,
            acquire : 30000,
            idle    : 10000,
        },
    };

}
