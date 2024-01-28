import { IAhaStatisticsRepo } from '../../../../../database/repository.interfaces/statistics/aha.statistics.repo.interface';
import mysql, { Connection } from 'mysql2/promise';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { AppName, CareplanCode, HealthSystem } from '../../../../../domain.types/statistics/aha/aha.type';

////////////////////////////////////////////////////////////////////////////////////////////

export class AhaStatisticsRepo implements IAhaStatisticsRepo {

    getTotalPatients = async (): Promise<number> => {
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

    getTotalActivePatients = async (): Promise<number> => {
        const query =   `SELECT count(distinct (pt.UserId)) as totalActivePatients from patients as pt
                        JOIN users as u ON pt.UserId = u.id
                        WHERE u.IsTestUser = 0
                        JOIN persons as p ON u.PersonId = p.id
                        WHERE p.DeletedAt is null`;
                        
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const activePatients: any = rows;
            if (activePatients.length === 1) {
                return activePatients[0].totalActivePatients;
            }
        } catch (error) {
            Logger.instance().log(`Unable to process total active patient count: ${error.message}`);
            throw new ApiError(500, `Unable to process total active patient count: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalDeletedPatients = async (): Promise<number> => {
        const query = `SELECT count(distinct (pt.UserId)) as totalDeletedPatients from patients as pt
                        JOIN users as u ON pt.UserId = u.id
                        JOIN persons as p ON u.PersonId = p.id
                        WHERE p.Phone not between "1000000000" and "1000000100" AND p.DeletedAt is not null`;

        // const query = `SELECT count(distinct (pt.UserId)) as totalDeletedPatients from patients as pt
        //                 JOIN users as u ON pt.UserId = u.id
        //                 WHERE u.IsTestUser = 0
        //                 JOIN persons as p ON u.PersonId = p.id
        //                 WHERE p.DeletedAt is not null`;
        
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const deletedPatients: any = rows;
            if (deletedPatients.length === 1) {
                return deletedPatients[0].totalDeletedPatients;
            }
        } catch (error) {
            Logger.instance().log(`Unable to process total deleted patient: ${error.message}`);
            throw new ApiError(500, `Unable to process total deleted patient: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalTestPatients = async (): Promise<number> => {
        const query = `SELECT count(distinct (pt.UserId)) as totalTestPatients from patients as pt
                        JOIN users as u ON pt.UserId = u.id
                        JOIN persons as p ON u.PersonId = p.id
                        WHERE p.Phone between "1000000000" and "1000000100" AND p.DeletedAt is null`;
        // const query = `SELECT count(distinct (pt.UserId)) as totalTestPatients from patients as pt
        //                 JOIN users as u ON pt.UserId = u.id
        //                 WHERE u.IsTestUser = 1
        //                 JOIN persons as p ON u.PersonId = p.id
        //                 WHERE p.DeletedAt is null`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const testPatient: any = rows;
            if (testPatient.length === 1) {
                return testPatient[0].totalTestPatients;
            }
        } catch (error) {
            Logger.instance().log(`Unable to process test patient: ${error.message}`);
            throw new ApiError(500, `Unable to process test patient: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalDeletedTestPatients = async (): Promise<number> => {
        const query = `SELECT count(distinct (pt.UserId)) as totalDeletedTestPatients from patients as pt
                    JOIN users as u ON pt.UserId = u.id
                    JOIN persons as p ON u.PersonId = p.id
                    WHERE p.Phone between "1000000000" and "1000000100" AND p.DeletedAt is not null`;
        // const query = `SELECT count(distinct (pt.UserId)) as totalDeletedTestPatients from patients as pt
        //             JOIN users as u ON pt.UserId = u.id
        //             WHERE u.IsTestUser = 1
        //             JOIN persons as p ON u.PersonId = p.id
        //             WHERE p.DeletedAt is not null`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const deletedTestPatient: any = rows;
            if (deletedTestPatient.length === 1) {
                return deletedTestPatient[0].totalDeletedTestPatients;
            }
        } catch (error) {
            Logger.instance().log(`Unable to process deleted test patient: ${error.message}`);
            throw new ApiError(500, `Unable to process deleted test patient: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalUsersWithMissingDeviceDetail = async (): Promise<number> => {
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

    getTotalUniqueUsersInDeviceDetail = async (): Promise<number> => {
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

    getAppSpecificTotalUsers = async (appName : AppName): Promise<number> => {
        const query =   `SELECT distinct(ud.UserId), AppName FROM user_device_details as ud
                        JOIN patients as pp ON pp.UserId = ud.UserId
                        JOIN users as u ON u.id = pp.UserId
                        JOIN persons as p ON p.id = u.PersonId
                        where p.Phone not between "1000000000" and "1000000100" and ud.AppName = '${appName}'`;
        // const query =   `SELECT distinct(ud.UserId), AppName FROM user_device_details as ud
        //                 JOIN patients as pp ON pp.UserId = ud.UserId
        //                 JOIN users as u ON u.id = pp.UserId
        //                 WHERE u.IsTestUser = 0
        //                 JOIN persons as p ON p.id = u.PersonId
        //                 where ud.AppName = '${appName}'`;
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

    getTotalUsersLoggedToHSAndHF = async (): Promise<number> => {
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
        // const query =  `SELECT distinct(ud.UserId)
        //                 FROM user_device_details as ud
        //                 JOIN users as u ON u.id = ud.UserId
        //                 WHERE u.IsTestUser = 0
        //                 JOIN persons as p ON p.id = u.PersonId
        //                 WHERE ud.AppName = 'Heart &amp; Stroke Helper™'
        //                 AND UserId IN (
        //                     SELECT distinct(ud.UserId)
        //                     FROM user_device_details ud
        //                     JOIN users as u ON u.id = ud.UserId
        //                     WHERE u.IsTestUser = 0
        //                     JOIN persons as p ON p.id = u.PersonId
        //                     WHERE ud.AppName = 'HF Helper'
        //                 )`;
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

    getAppSpecificPatientHealthProfileData = async (appName : AppName): Promise<number> => {
        const query =  `SELECT ph.id, ph.PatientUserId, ud.AppName,
                        ph.MaritalStatus, ph.HasHeartAilment, ph.OtherConditions, ph.Occupation, 
                        ph. IsDiabetic, ph.BloodGroup, ph.MajorAilment, ph.IsSmoker, ph.HasHighBloodPressure, ph.HasHighCholesterol, ph.HasHeartAilment, ph.CreatedAt, 
                        ph.UpdatedAt, ph.DeletedAt 
                        FROM patient_health_profiles as ph
                        JOIN users as u ON u.id = ph.PatientUserId
                        LEFT JOIN  user_device_details as ud ON ud.UserId = ph.PatientUserId
                        WHERE u.IsTestUser = 0 and ud.AppName = '${appName}'`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const patientHealthProfileData: any = rows;
            return patientHealthProfileData.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved patient health profile data: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved patient health profile data: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getAppSpecificTotalPatients = async (appName : AppName): Promise<number> => {
        const query =  `SELECT p.id, p.UserId, p.HealthSystem, p.AssociatedHospital, p.CreatedAt, p.UpdatedAt, p.DeletedAt
                        FROM patients as p
                        JOIN users as u ON u.id = p.UserId
                        LEFT JOIN  user_device_details as ud ON ud.UserId = p.UserId
                        WHERE u.IsTestUser = 0 and ud.AppName = '${appName}'`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const patientCount: any = rows;
            return patientCount.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved HS patient data: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved HS patient data: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getAppSpecificTotalPerson = async (appName : AppName): Promise<number> => {
        const query =  `SELECT p.id, p.Phone, p.Gender, p.SelfIdentifiedGender, p.CreatedAt, p.UpdatedAt, p.DeletedAt
                        FROM persons as p
                        JOIN users as u ON u.PersonId = p.id
                        LEFT JOIN  user_device_details as ud ON ud.UserId = u.id
                        WHERE u.IsTestUser = 0 and ud.AppName = '${appName}'`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const personCount: any = rows;
            return personCount.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved HS person data: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved HS person data: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getAppSpecificDailyAssessmentCount = async (appName : AppName): Promise<number> => {
        const query =  `SELECT d.id, d.PatientUserId, d.Feeling, d.Mood, d.EnergyLevels, d.CreatedAt, d.UpdatedAt, d.DeletedAt
                        FROM daily_assessments as d
                        JOIN users as u ON u.id = d.PatientUserId
                        LEFT JOIN  user_device_details as ud ON ud.UserId = u.id
                        WHERE u.IsTestUser = 0 and ud.AppName = '${appName}'`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const dailyAssessmentCount: any = rows;
            return dailyAssessmentCount.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved HS daily Assessment: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved HS daily Assessment: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getAppSpecificBodyWeightDataCount = async (appName : AppName): Promise<number> => {
        const query =  `SELECT bw.id, bw.PatientUserId, bw.BodyWeight,bw.Unit, bw.CreatedAt, bw.UpdatedAt, bw.DeletedAt
                        FROM biometrics_body_weight as bw
                        JOIN users as u ON u.id = bw.PatientUserId
                        LEFT JOIN  user_device_details as ud ON ud.UserId = u.id
                        WHERE u.IsTestUser = 0 and ud.AppName = '${appName}'`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const bodyWeightCount: any = rows;
            return bodyWeightCount.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved HS body weight: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved HS body weight: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getAppSpecificLabRecordCount = async (appName : AppName): Promise<number> => {
        const query =  `SELECT lr.id, lr.PatientUserId, lr.TypeName, lr.DisplayName, lr.PrimaryValue,lr.SecondaryValue, lr.RecordedAt, lr.Unit, lr.CreatedAt, lr.UpdatedAt, lr.DeletedAt
                        FROM lab_records as lr
                        JOIN users as u ON u.id = lr.PatientUserId
                        LEFT JOIN  user_device_details as ud ON ud.UserId = u.id
                        WHERE u.IsTestUser = 0 and ud.AppName = '${appName}'`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const labRecordCount: any = rows;
            return labRecordCount.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved HS lab record: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved HS lab record: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getAppSpecificCareplanActivityCount = async (appName : AppName): Promise<number> => {
        const query =  `SELECT ca.id, ca.PatientUserId, ca.PlanName, ca.PlanCode, ca.CreatedAt, ca.UpdatedAt, ca.DeletedAt
                        FROM careplan_activities as ca
                        JOIN users as u ON u.id = ca.PatientUserId
                        LEFT JOIN  user_device_details as ud ON ud.UserId = u.id
                        WHERE  u.IsTestUser = 0 and ud.AppName = '${appName}'`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const careplanActivity: any = rows;
            return careplanActivity.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved HS lab record: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved HS lab record: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getAppSpecificMedicationConsumptionCount = async (appName : AppName): Promise<number> => {
        const query =  `SELECT mc.id, mc.PatientUserId, mc.Dose, mc.DrugName, mc.TimeScheduleStart, mc.TimeScheduleEnd, mc.TakenAt, mc.IsTaken, mc.IsMissed, mc.CancelledOn, mc.CreatedAt, mc.UpdatedAt, mc.DeletedAt
                        FROM medication_consumptions as mc
                        JOIN users as u ON u.id = mc.PatientUserId
                        LEFT JOIN  user_device_details as ud ON ud.UserId = u.id
                        WHERE u.IsTestUser = 0 and ud.AppName = '${appName}'`;
        // const query =   `SELECT distinct(ud.UserId), AppName FROM user_device_details as ud
        //                 JOIN patients as pp ON pp.UserId = ud.UserId
        //                 JOIN users as u ON u.id = pp.UserId
        //                 WHERE u.IsTestUser = 0
        //                 JOIN persons as p ON p.id = u.PersonId
        //                 WHERE ud.AppName = 'Heart &amp; Stroke Helper™'`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const medicationConsumption: any = rows;
            return medicationConsumption.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved HS medication consumption: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved HS medication consumption: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getUserAssessmentCount = async (): Promise<number> => {
        const query =  `SELECT a.id, a.PatientUserId, ce.PlanCode, a.Title, a.Status, a.StartedAt, a.FinishedAt, a.CreatedAt, a.UpdatedAt, a.DeletedAt
                        FROM assessments as a
                        JOIN careplan_enrollments as ce ON a.PatientUserId = ce.PatientUserId
                        JOIN users as u ON u.id = ce.PatientUserId
                        LEFT JOIN  user_device_details as ud ON ud.UserId = u.id
                        WHERE u.IsTestUser = 0 and ce.PlanCode = 'Cholesterol' and ud.AppName = 'Heart &amp; Stroke Helper™'`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const assessment: any = rows;
            return assessment.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved HS assessment: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved HS assessment: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalUsers = async (): Promise<number> => {
        const query =  `SELECT * FROM users`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const users: any = rows;
            return users.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved users: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved users: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalDeletedUsers = async (): Promise<number> => {
        const query =  `SELECT count(*) as totalDeletedUsers from users as u
                        JOIN persons as p ON u.PersonId = p.id
                        WHERE p.Phone not between "1000000000" and "1000000100" AND p.DeletedAt is not null`;
        // const query =  `SELECT count(*) as totalDeletedUsers from users as u
        //                 WHERE u.IsTestUser = 0
        //                 JOIN persons as p ON u.PersonId = p.id
        //                 WHERE p.DeletedAt is not null`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const deletedUsers: any = rows;
            if (deletedUsers.length === 1) {
                return deletedUsers[0].totalDeletedUsers;
            }
        } catch (error) {
            Logger.instance().log(`Unable to retrieved deleted users: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved deleted users: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalTestUsers = async (): Promise<number> => {
        const query =  `SELECT count(*) as totalTestUsers from users as u
                        JOIN persons as p ON u.PersonId = p.id
                        WHERE p.Phone between "1000000000" and "1000000100" AND p.DeletedAt is null`;
        // const query =  `SELECT count(*) as totalTestUsers from users as u
        //                 WHERE u.IsTestUser = 1
        //                 JOIN persons as p ON u.PersonId = p.id
        //                 WHERE p.DeletedAt is null`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const testUsers: any = rows;
            if (testUsers.length === 1) {
                return testUsers[0].totalTestUsers;
            }
        } catch (error) {
            Logger.instance().log(`Unable to retrieved test users: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved test users: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalDeletedTestUsers = async (): Promise<number> => {
        const query =  `SELECT count(*) as totalDeletedTestUsers from users as u
                        JOIN persons as p ON u.PersonId = p.id
                        WHERE p.Phone between "1000000000" and "1000000100" AND p.DeletedAt is not null`;
        // const query =  `SELECT count(*) as totalDeletedTestUsers from users as u
        //                 WHERE u.IsTestUser = 1
        //                 JOIN persons as p ON u.PersonId = p.id
        //                 WHERE p.DeletedAt is not null`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const deletedTestUsers: any = rows;
            if (deletedTestUsers.length === 1) {
                return deletedTestUsers[0].totalDeletedTestUsers;
            }
        } catch (error) {
            Logger.instance().log(`Unable to retrieved deleted test users: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved deleted test users: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalActiveUsers = async (): Promise<number> => {
        const query =  `SELECT count(*) as totalActiveUsers from users as u
                        JOIN persons as p ON u.PersonId = p.id
                        WHERE p.Phone not between "1000000000" and "1000000100" AND p.DeletedAt is null`;
        // const query =  `SELECT count(*) from users as u
        //                 WHERE u.IsTestUser = 0
        //                 JOIN persons as p ON u.PersonId = p.id
        //                 WHERE p.DeletedAt is null
        //

        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const activeUsers: any = rows;
            if (activeUsers.length === 1) {
                return activeUsers[0].totalActiveUsers;
            }
        } catch (error) {
            Logger.instance().log(`Unable to retrieved active users: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved active users: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalPersons = async (): Promise<number> => {
        const query =  `SELECT * FROM persons;`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const persons: any = rows;
            return persons.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved persons: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved persons: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalActivePersons = async (): Promise<number> => {
        const query =  `SELECT count(*) as totalActivePersons from persons as p
                        WHERE p.Phone not between "1000000000" and "1000000100" AND p.DeletedAt is null`;
        // const query =  `SELECT count(*) as totalActivePersons from persons as p
        //                 WHERE p.DeletedAt is null
        //                 JOIN users as u ON u.PersonId = p.id
        //                 WHERE u.IsTestUser = 0`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const activePersons: any = rows;
            if (activePersons.length === 1) {
                return activePersons[0].totalActivePersons;
            }
        } catch (error) {
            Logger.instance().log(`Unable to retrieved active persons: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved active persons: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalDeletedPersons = async (): Promise<number> => {
        const query =  `SELECT count(*) as totalDeletedPersons from persons as p
                        WHERE p.Phone not between "1000000000" and "1000000100" AND p.DeletedAt is not null`;
        // const query =  `SELECT count(*) as totalDeletedPersons from persons as p
        //                 WHERE p.DeletedAt is not null
        //                 JOIN users as u ON u.PersonId = p.id
        //                 WHERE u.IsTestUser = 0`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const deletedUsers: any = rows;
            if (deletedUsers.length === 1) {
                return deletedUsers[0].totalDeletedPersons;
            }
        } catch (error) {
            Logger.instance().log(`Unable to retrieved deleted users: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved deleted users: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalTestPersons = async (): Promise<number> => {
        const query =  `SELECT count(*) as totalTestPersons from persons as p
                        WHERE p.Phone between "1000000000" and "1000000100" AND p.DeletedAt is null`;
        // const query =  `SELECT count(*) as totalTestPersons from persons as p
        //                 WHERE p.DeletedAt is null
        //                 JOIN users as u ON u.PersonId = p.id
        //                 WHERE u.IsTestUser = 1`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const testPersons: any = rows;
            if (testPersons.length === 1) {
                return testPersons[0].totalTestPersons;
            }
        } catch (error) {
            Logger.instance().log(`Unable to retrieved test person: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved test person: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalDeletedTestPersons = async (): Promise<number> => {
        const query =  `SELECT count(*) as totalDeletedTestPersons from persons as p
                        WHERE p.Phone between "1000000000" and "1000000100" AND p.DeletedAt is not null`;

        // const query =  `SELECT count(*) as totalDeletedTestPersons from persons as p
        //                 WHERE p.DeletedAt is not null
        //                 JOIN users as u ON p.id = u.PersonId
        //                 WHERE u.IsTestUser = 1`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const deletedTestPersons: any = rows;
            if (deletedTestPersons.length === 1) {
                return deletedTestPersons[0].totalDeletedTestPersons;
            }
        } catch (error) {
            Logger.instance().log(`Unable to retrieved deleted test persons: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved deleted test persons: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalDoctors = async (): Promise<number> => {
        const query =  `SELECT * FROM doctors`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const doctors: any = rows;
            return doctors.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved doctors: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved doctors: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalActiveDoctors = async (): Promise<number> => {
        const query =  `select count(distinct (UserId)) as totalActiveDoctors from doctors as d
                        JOIN users as u ON d.UserId = u.id
                        JOIN persons as p ON u.PersonId = p.id
                        WHERE p.Phone not between "1000000000" and "1000000100" AND p.DeletedAt is null`;
        // const query =  `select count(distinct (UserId)) as totalActiveDoctors from doctors as d
        //                 JOIN users as u ON d.UserId = u.id
        //                 WHERE u.IsTestUser = 0
        //                 JOIN persons as p ON u.PersonId = p.id
        //                 WHERE p.DeletedAt is null`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const activeDoctors: any = rows;
            if (activeDoctors.length === 1) {
                return activeDoctors[0].totalActiveDoctors;
            }
        } catch (error) {
            Logger.instance().log(`Unable to retrieved active doctors: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved active doctors: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalDeletedDoctors = async (): Promise<number> => {
        const query =  `select count(distinct (UserId)) as totalDeletedDoctors from doctors as d
                        JOIN users as u ON d.UserId = u.id
                        JOIN persons as p ON u.PersonId = p.id
                        WHERE p.Phone not between "1000000000" and "1000000100" AND p.DeletedAt is not null`;

        // const query =  `select count(distinct (UserId)) as totalDeletedDoctors from doctors as d
        //                 JOIN users as u ON d.UserId = u.id
        //                 WHERE u.IsTestUser = 0
        //                 JOIN persons as p ON u.PersonId = p.id
        //                 WHERE p.DeletedAt is not null`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const deletedDoctors: any = rows;
            if (deletedDoctors.length === 1) {
                return deletedDoctors[0].totalDeletedDoctors;
            }
        } catch (error) {
            Logger.instance().log(`Unable to retrieved deleted doctors: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved deleted doctors: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalTestDoctors = async (): Promise<number> => {
        const query =  `select count(distinct (UserId)) as totalTestDoctors from doctors as d
                        JOIN users as u ON d.UserId = u.id
                        JOIN persons as p ON u.PersonId = p.id
                        WHERE p.Phone between "1000000000" and "1000000100" AND p.DeletedAt is null;`;

        // const query =  `select count(distinct (UserId)) as totalTestDoctors from doctors as d
        //                 JOIN users as u ON d.UserId = u.id
        //                 WHERE u.IsTestUser = 1
        //                 JOIN persons as p ON u.PersonId = p.id
        //                 WHERE p.DeletedAt is null;`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const testDoctors: any = rows;
            if (testDoctors.length === 1) {
                return testDoctors[0].totalTestDoctors;
            }
        } catch (error) {
            Logger.instance().log(`Unable to retrieved test doctors: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved test doctors: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalDeletedTestDoctors = async (): Promise<number> => {
        const query =  `select count(distinct (UserId)) as totalDeletedTestDoctors from doctors as d
                        JOIN users as u ON d.UserId = u.id
                        JOIN persons as p ON u.PersonId = p.id
                        WHERE p.Phone between "1000000000" and "1000000100" AND p.DeletedAt is not null`;
        // const query =  `select count(distinct (UserId)) as totalDeletedTestDoctors from doctors as d
        //                 JOIN users as u ON d.UserId = u.id
        //                 WHERE u.IsTestUser = 1
        //                 JOIN persons as p ON u.PersonId = p.id
        //                 WHERE p.DeletedAt is not null`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const deletedTestDoctors: any = rows;
            if (deletedTestDoctors.length === 1) {
                return deletedTestDoctors[0].totalDeletedTestDoctors;
            }
        } catch (error) {
            Logger.instance().log(`Unable to retrieved deleted test doctors: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved deleted test doctors: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalCareplanEnrollments = async (): Promise<number> => {
        const query =  `SELECT * FROM careplan_enrollments`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const careplanEnrollments: any = rows;
            return careplanEnrollments.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved careplan Enrollments: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved careplan Enrollments: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalEnrollments = async (careplanCode: CareplanCode): Promise<number> => {
        const query =  `SELECT * FROM careplan_enrollments where PlanCode = '${careplanCode}'`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const cholesterolEnrollments: any = rows;
            return cholesterolEnrollments.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved ${careplanCode} Enrollments: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved ${careplanCode} Enrollments: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalActiveEnrollments = async (careplanCode: CareplanCode): Promise<number> => {
        const query =  `select distinct (ce.PatientUserId) from careplan_enrollments as ce where ce.PlanCode = '${careplanCode}' 
                        AND ce.PatientUserId IN 
                        (
                            SELECT distinct (pt.UserId) from patients as pt
                            JOIN users as u ON pt.UserId = u.id
                            JOIN persons as p ON u.PersonId = p.id
                            WHERE p.Phone not between "1000000000" and "1000000100" AND p.DeletedAt is null
                        )`;
        // const query =  `select distinct (ce.PatientUserId) from careplan_enrollments as ce where ce.PlanCode = '${careplanCode}'
        //                 AND ce.PatientUserId IN
        //                 (
        //                     SELECT distinct (pt.UserId) from patients as pt
        //                     JOIN users as u ON pt.UserId = u.id
        //                     WHERE u.IsTestUser = 0
        //                     JOIN persons as p ON u.PersonId = p.id
        //                     WHERE p.DeletedAt is null
        //                 )`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const cholesterolEnrollments: any = rows;
            return cholesterolEnrollments.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved active ${careplanCode} Enrollments: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved active ${careplanCode} Enrollments: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalDeletedEnrollments = async (careplanCode: CareplanCode): Promise<number> => {
        const query =  `select distinct (ce.PatientUserId) from careplan_enrollments as ce where ce.PlanCode = '${careplanCode}' 
                        AND ce.PatientUserId IN 
                        (
                            SELECT distinct (pt.UserId) from patients as pt
                            JOIN users as u ON pt.UserId = u.id
                            JOIN persons as p ON u.PersonId = p.id
                            WHERE p.Phone not between "1000000000" and "1000000100" AND p.DeletedAt is not null
                        )`;
        // const query =  `select distinct (ce.PatientUserId) from careplan_enrollments as ce where ce.PlanCode = '${careplanCode}'
        //                 AND ce.PatientUserId IN
        //                 (
        //                     SELECT distinct (pt.UserId) from patients as pt
        //                     JOIN users as u ON pt.UserId = u.id
        //                     WHERE u.IsTestUser = 0
        //                     JOIN persons as p ON u.PersonId = p.id
        //                     WHERE p.DeletedAt is not null
        //                 )`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const deletedEnrollments: any = rows;
            return deletedEnrollments.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved deleted ${careplanCode} Enrollments: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved deleted ${careplanCode} Enrollments: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalTestUsersForCareplanEnrollments = async (careplanCode: CareplanCode): Promise<number> => {
        const query =  `select distinct (ce.PatientUserId) from careplan_enrollments as ce where ce.PlanCode = '${careplanCode}' 
                        AND ce.PatientUserId IN 
                        (
                            SELECT distinct (pt.UserId) from patients as pt
                            JOIN users as u ON pt.UserId = u.id
                            JOIN persons as p ON u.PersonId = p.id
                            WHERE p.Phone between "1000000000" and "1000000100" AND p.DeletedAt is null
                        )`;
        // const query =  `select distinct (ce.PatientUserId) from careplan_enrollments as ce where ce.PlanCode = '${careplanCode}'
        //                 AND ce.PatientUserId IN
        //                 (
        //                     SELECT distinct (pt.UserId) from patients as pt
        //                     JOIN users as u ON pt.UserId = u.id
        //                     WHERE u.IsTestUser = 1
        //                     JOIN persons as p ON u.PersonId = p.id
        //                     WHERE p.DeletedAt is null
        //                 )`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const testUsersForCareplanEnrollments: any = rows;
            return testUsersForCareplanEnrollments.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved test users for ${careplanCode} careplan: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved test users for ${careplanCode} careplan: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getTotalDeletedTestUsersForCareplanEnrollments = async (careplanCode: CareplanCode): Promise<number> => {
        const query =  `select distinct (ce.PatientUserId) from careplan_enrollments as ce where ce.PlanCode = '${careplanCode}' 
                        AND ce.PatientUserId IN 
                        (
                            SELECT distinct (pt.UserId) from patients as pt
                            JOIN users as u ON pt.UserId = u.id
                            JOIN persons as p ON u.PersonId = p.id
                            WHERE p.Phone between "1000000000" and "1000000100" AND p.DeletedAt is not null
                        )`;

        // const query =  `select distinct (ce.PatientUserId) from careplan_enrollments as ce where ce.PlanCode = '${careplanCode}'
        //                 AND ce.PatientUserId IN
        //                 (
        //                     SELECT distinct (pt.UserId) from patients as pt
        //                     JOIN users as u ON pt.UserId = u.id
        //                     WHERE u.IsTestUser = 1
        //                     JOIN persons as p ON u.PersonId = p.id
        //                     WHERE p.DeletedAt is not null
        //                 )`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const deletedTestUsersForCareplanEnrollments: any = rows;
            return deletedTestUsersForCareplanEnrollments.length;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved deleted test users for ${careplanCode} careplan: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved deleted test users for ${careplanCode} careplan: ${error.message}`);
        } finally {
            connection.end();
        }
    };

   
    getHealthSystemEnrollmentCount = async (careplanCode:CareplanCode, healthSystem : HealthSystem): Promise<any> => {
        // let query = ahaSqlQuerries.queryHealthSystemEnrollmentCount;
        // query = query.replace('{{careplanCode}}', careplanCode);
        // query = query.replace('{{healthSystem}}', healthSystem);
        // const results = executeQuery(query);
        
        const query =  `select distinct (ce.PatientUserId), p.Phone, p.FirstName, p.LastName, ce.Plancode, ce.StartDate,
                        ce.EndDate, pt.HealthSystem, pt.AssociatedHospital, p.DeletedAt from careplan_enrollments as ce 
                        JOIN users as u ON ce.PatientUserId = u.id
                        JOIN patients as pt ON u.id = pt.UserId
                        JOIN persons as p ON u.PersonId = p.id
                        where ce.PlanCode = "${careplanCode}" 
                        AND ce.PatientUserId IN 
                        (
                            SELECT distinct (u.id) from users as u
                            Join patients as pt on pt.UserId = u.id
                            WHERE u.IsTestUser = 0 AND pt.HealthSystem = '${healthSystem}'
                        )`;

        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const careplanEnrollments: any = rows;
            const hospitals = this.extractHospitals(careplanEnrollments);
            const patientCountForHospital = this.extractPatientCountForHospital(hospitals, careplanEnrollments);
            return {
                CareplanCode            : careplanCode,
                HealthSystem            : healthSystem,
                CareplanEnrollmentCount : careplanEnrollments.length,
                PatientCountForHospital : patientCountForHospital
            };
        } catch (error) {
            Logger.instance().log(`Unable to retrieved deleted test users for ${healthSystem} careplan: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved deleted test users for ${healthSystem} careplan: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getListOfCareplan = async () => {
        const query =  `SELECT distinct(PlanCode) FROM careplan_enrollments;`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const careplans: any = rows;
            return careplans;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved list of careplans: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved list of careplans: ${error.message}: ${error.message}`);
        } finally {
            connection.end();
        }
    };

    getListOfHealthSystem = async () => {
        const query =  `SELECT distinct(HealthSystem) FROM patients`;
        let connection: Connection = null;
        try {
            connection = await this.createDbConnection();
            const [rows] = await connection.execute(query);
            const healthSystems: any = rows;
            return healthSystems;
        } catch (error) {
            Logger.instance().log(`Unable to retrieved list of health system: ${error.message}`);
            throw new ApiError(500, `Unable to retrieved list of health system: ${error.message}: ${error.message}`);
        } finally {
            connection.end();
        }
    };
    
    private extractHospitals = (careplanEnrollments) => {
        const hospitals: string[] = [];
        careplanEnrollments.forEach(element => {
            if (element.AssociatedHospital){
                const hospitalName = element.AssociatedHospital;
                if (!hospitals.includes(hospitalName)) {
                    hospitals.push(hospitalName);
                }
            }
        });
        return hospitals;
    };

    private extractPatientCountForHospital = (hospitals, careplanEnrollments) => {
        const patientCountForHospital:any = [];
        hospitals.forEach(hospital => {
            const patientCount = careplanEnrollments.filter(x => hospital === x.AssociatedHospital);
            patientCountForHospital.push({
                HospitalName : hospital,
                PatientCount : patientCount.length
            });
        });
        return patientCountForHospital;
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
