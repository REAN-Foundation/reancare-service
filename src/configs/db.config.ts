const fs = require('fs');

if (typeof process.env.NODE_ENV === 'undefined') {
  require('dotenv').config();
}

if (process.env.NODE_ENV == 'test') {
  //require('dotenv').config();
  // console.log('================================================');
  // console.log('Environment: ' + process.env.NODE_ENV);
  // console.log('Database: ' + process.env.DB_NAME);
  // console.log('Database: ' + process.env.DB_USER_NAME);
  // console.log('================================================');
}

export class DbConfig {

    public static config = {
        username: process.env.DB_USER_NAME,
        password: process.env.DB_USER_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        pool: {
            max: 20,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    };
}
