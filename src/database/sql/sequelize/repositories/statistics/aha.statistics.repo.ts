import { IAhaStatisticsRepo } from '../../../../../database/repository.interfaces/statistics/aha.statistics.repo.interface';
import mysql, { Connection } from 'mysql2/promise';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';

////////////////////////////////////////////////////////////////////////////////////////////
// const connection = mysql.createConnection({
//     host     : process.env.DB_HOST,
//     user     : process.env.DB_USER_NAME,
//     password : process.env.DB_USER_PASSWORD,
//     database : process.env.DB_NAME
// });
// const sequelizeStats = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER_NAME,
//     process.env.DB_USER_PASSWORD, {
//         host    : process.env.DB_HOST,
//         dialect : process.env.DB_DIALECT  as Dialect,
//     });
    
//////////////////////////////////////////////////////////////////////////////////////////////

export class AhaStatisticsRepo implements IAhaStatisticsRepo {
    
    getAhaStatistics = async () => {
        const connection = await this.createDbConnection();
        // const connection = await mysql.createConnection({
        //     host     : process.env.DB_HOST,
        //     user     : process.env.DB_USER_NAME,
        //     password : process.env.DB_USER_PASSWORD,
        //     database : process.env.DB_NAME
        // });
        // connection.query('SELECT * FROM patients', (err, results) => {
        //     if (err) {
        //         console.log('Error executing query', err);
        //     } else {
        //         console.log('Query result:', results);
        //         result = results;
        //     }
        // });
        const [rows, fields] = await connection.execute('SELECT * FROM patients');
        console.log(JSON.stringify(rows));
        console.log('Our result is ',rows);
        return rows;
    };

    getTotalPatients = async () => {
        const query = `SELECT * FROM patients`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const patients: any = rows;
            return patients.length;
        } catch (error) {
            Logger.instance().log(`Unable to process total patient count: ${error.message}`);
            throw new ApiError(500, `Unable to process total patient count: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getUsersWithMissingDeviceDetails = async () => {
        const query =   `SELECT u.id, u.username
                        FROM users as u
                        JOIN patients p ON u.id = p.UserId
                        LEFT JOIN user_device_details d ON u.id = d.UserId
                        WHERE d.id IS NULL`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const usersWithMissingDeviceDetails: any = rows;
            return usersWithMissingDeviceDetails.length;
        } catch (error) {
            Logger.instance().log(`Unable to process users with missing device details: ${error.message}`);
            throw new ApiError(500, `Unable to process users with missing device details: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getUniqueUsersInDeviceDetails = async () => {
        const query =   `SELECT distinct(UserId) FROM user_device_details`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const uniqueUsersInDeviceDetails: any = rows;
            return uniqueUsersInDeviceDetails.length;
        } catch (error) {
            Logger.instance().log(`Unable to process unique users in device details table: ${error.message}`);
            throw new ApiError(500, `Unable to process unique users in device details table: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getHSUserCount = async () => {
        const query =   `SELECT distinct(ud.UserId), AppName FROM user_device_details as ud
                        JOIN patients as pp ON pp.UserId = ud.UserId
                        JOIN users as u ON u.id = pp.UserId
                        JOIN persons as p ON p.id = u.PersonId
                        where p.Phone not between "1000000000" and "1000000100" and ud.AppName = 'Heart &amp; Stroke Helper™'`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const hsUserCount: any = rows;
            return hsUserCount.length;
        } catch (error) {
            Logger.instance().log(`Unable to process HS user count: ${error.message}`);
            throw new ApiError(500, `Unable to process HS user count: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getUsersLoggedCountToHSAndHF = async () => {
        const query =  `SELECT distinct(ud.UserId)
                        FROM user_device_details as ud
                        JOIN users as u ON u.id = ud.UserId
                        JOIN persons as p ON p.id = u.PersonId
                        WHERE ud.AppName = 'Heart &amp; Stroke Helper™' and p.Phone not between "1000000000" and "1000000100"
                        AND UserId IN (
                            SELECT distinct(ud.UserId)
                            FROM user_device_details ud
                            JOIN users as u ON u.id = ud.UserId
                            JOIN persons as p ON p.id = u.PersonId
                            WHERE ud.AppName = 'HF Helper' and p.Phone not between "1000000000" and "1000000100"
                        )`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const usersLoggedCountToHSAndHF: any = rows;
            return usersLoggedCountToHSAndHF.length;
        } catch (error) {
            Logger.instance().log(`Unable to process logged user count to HS & HF: ${error.message}`);
            throw new ApiError(500, `Unable to process logged user count to HS & HF: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    private createDbConnection = async (): Promise<Connection> => {
        const connection = await mysql.createConnection({
            host     : process.env.DB_HOST,
            user     : process.env.DB_USER_NAME,
            password : process.env.DB_USER_PASSWORD,
            database : process.env.DB_NAME
        });
        return connection;
    };

}
