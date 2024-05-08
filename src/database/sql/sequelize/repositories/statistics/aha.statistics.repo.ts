import { IAhaStatisticsRepo } from '../../../../../database/repository.interfaces/statistics/aha.statistics.repo.interface';
import { Logger } from '../../../../../common/logger';
import { CareplanHealthSystem } from '../../../../../domain.types/statistics/aha/aha.type';
import { queryAhaTenant, queryCareplanList, queryHealthSystemEnrollmentCount, queryListOfHealthSystem, queryTotalActiveEnrollments, queryTotalDeletedEnrollments, queryTotalEnrollments } from './query/aha.sql';
import { Helper } from '../../../../../common/helper';
import { DatabaseSchemaType } from '../../../../../common/database.utils/database.config';
import {
    queryTotalActiveDoctors,
    queryTotalActivePatients,
    queryTotalActivePersons,
    queryTotalActiveUsers,
    queryTotalDeletedDoctors,
    queryTotalDeletedPatients,
    queryTotalDeletedPersons,
    queryTotalDeletedUsers,
    queryTotalDoctors,
    queryTotalPatients,
    queryTotalPersons,
    queryTotalUsers,
    queryUniqueUsersInDeviceDetail,
    queryUsersWithMissingDeviceDetail } from './query/system.user.sql';
import { DatabaseClient } from '../../../../../common/database.utils/dialect.clients/database.client';

////////////////////////////////////////////////////////////////////////////////////////////

export class AhaStatisticsRepo implements IAhaStatisticsRepo {

    public dbConnector: DatabaseClient = null;

    constructor() {
        this.dbConnector = new DatabaseClient();
        this.dbConnector._client.connect(DatabaseSchemaType.Primary);
    }

    getAhaTenant = async (): Promise<string> => {
        const query = queryAhaTenant;
        try {
            const [rows] = await this.dbConnector._client.executeQuery(query);
            const tenantIds: any = rows;
            if (tenantIds.length === 1) {
                return tenantIds[0].id;
            }
            return null;
        } catch (error) {
            Logger.instance().log(`Unable to get AHA tenant id: ${error.message}`);
            // throw new ApiError(500, `Unable to process total patient count: ${error.message}`);
        }
    };
    
    getTotalPatients = async (): Promise<number> => {
        const query = queryTotalPatients;
        let totalPatients = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalPatients_: any = rows;
        if (totalPatients_.length === 1) {
            totalPatients = totalPatients_[0].totalPatients;
        }
        return totalPatients;
    };

    getTotalActivePatients = async (): Promise<number> => {
        const query = queryTotalActivePatients;
        let totalActivePatients = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalActivePatients_: any = rows;
        if (totalActivePatients_.length === 1) {
            totalActivePatients = totalActivePatients_[0].totalActivePatients;
        }
        return totalActivePatients;
    };

    getTotalDeletedPatients = async (): Promise<number> => {
        const query = queryTotalDeletedPatients;
        let totalDeletedPatients = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalDeletedPatients_: any = rows;
        if (totalDeletedPatients_.length === 1) {
            totalDeletedPatients = totalDeletedPatients_[0].totalDeletedPatients;
        }
        return totalDeletedPatients;
    };

    getTotalUsersWithMissingDeviceDetail = async (): Promise<number> => {
        const query = queryUsersWithMissingDeviceDetail;
        let totalUsersWithMissingDeviceDetail = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalUsersWithMissingDeviceDetail_: any = rows;
        if (totalUsersWithMissingDeviceDetail_.length === 1) {
            totalUsersWithMissingDeviceDetail = totalUsersWithMissingDeviceDetail_[0].count;
        }
        return totalUsersWithMissingDeviceDetail;
    };

    getTotalUniqueUsersInDeviceDetail = async (): Promise<number> => {
        const query = queryUniqueUsersInDeviceDetail;
        let totalUniqueUsersInDeviceDetail = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalUniqueUsersInDeviceDetail_: any = rows;
        if (totalUniqueUsersInDeviceDetail_.length === 1) {
            totalUniqueUsersInDeviceDetail = totalUniqueUsersInDeviceDetail_[0].count;
        }
        return totalUniqueUsersInDeviceDetail;
    };

    getTotalUsers = async (): Promise<number> => {
        const query = queryTotalUsers;
        let totalUsers = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalUsers_: any = rows;
        if (totalUsers_.length === 1) {
            totalUsers = totalUsers_[0].totalUsers;
        }
        return totalUsers;
    };

    getTotalDeletedUsers = async (): Promise<number> => {
        const query = queryTotalDeletedUsers;
        let totalDeletedUsers = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalDeletedUsers_: any = rows;
        if (totalDeletedUsers_.length === 1) {
            totalDeletedUsers = totalDeletedUsers_[0].totalDeletedUsers;
        }
        return totalDeletedUsers;
    };

    getTotalActiveUsers = async (): Promise<number> => {
        const query = queryTotalActiveUsers;
        let totalActiveUsers = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalActiveUsers_: any = rows;
        if (totalActiveUsers_.length === 1) {
            totalActiveUsers = totalActiveUsers_[0].totalActiveUsers;
        }
        return totalActiveUsers;
    };

    getTotalPersons = async (): Promise<number> => {
        const query = queryTotalPersons;
        let totalPersons = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalPersons_: any = rows;
        if (totalPersons_.length === 1) {
            totalPersons = totalPersons_[0].totalPersons;
        }
        return totalPersons;
    };

    getTotalActivePersons = async (): Promise<number> => {
        const query = queryTotalActivePersons;
        let totalActivePersons = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalActivePersons_: any = rows;
        if (totalActivePersons_.length === 1) {
            totalActivePersons = totalActivePersons_[0].totalActivePersons;
        }
        return totalActivePersons;
    };

    getTotalDeletedPersons = async (): Promise<number> => {
        const query = queryTotalDeletedPersons;
        let totalDeletedPersons = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalDeletedPersons_: any = rows;
        if (totalDeletedPersons_.length === 1) {
            totalDeletedPersons = totalDeletedPersons_[0].totalDeletedPersons;
        }
        return totalDeletedPersons;
    };

    getTotalDoctors = async (): Promise<number> => {
        const query = queryTotalDoctors;
        let totalDoctors = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalDoctors_: any = rows;
        if (totalDoctors_.length === 1) {
            totalDoctors = totalDoctors_[0].totalDoctors;
        }
        return totalDoctors;
    };

    getTotalActiveDoctors = async (): Promise<number> => {
        const query = queryTotalActiveDoctors;
        let totalActiveDoctors = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalActiveDoctors_: any = rows;
        if (totalActiveDoctors_.length === 1) {
            totalActiveDoctors = totalActiveDoctors_[0].totalActiveDoctors;
        }
        return totalActiveDoctors;
    };

    getTotalDeletedDoctors = async (): Promise<number> => {
        const query = queryTotalDeletedDoctors;
        let totalDeletedDoctors = null;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const totalDeletedDoctors_: any = rows;
        if (totalDeletedDoctors_.length === 1) {
            totalDeletedDoctors = totalDeletedDoctors_[0].totalDeletedDoctors;
        }
        return totalDeletedDoctors;
    };

    getTotalEnrollments = async (careplanCode: string, tenantId: string): Promise<number> => {
        let query = Helper.replaceAll(queryTotalEnrollments,'{{careplanCode}}',careplanCode);
        query = Helper.replaceAll(query, '{{tenantId}}',tenantId);
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const enrollments: any = rows;
        if (enrollments.length === 1) {
            return enrollments[0].totalEnrollments;
        }
    };

    getTotalActiveEnrollments = async (careplanCode: string, tenantId: string): Promise<number> => {
        let query = Helper.replaceAll(queryTotalActiveEnrollments,'{{careplanCode}}',careplanCode);
        query = Helper.replaceAll(query, '{{tenantId}}',tenantId);
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const deletedEnrollments: any = rows;
        if (deletedEnrollments.length === 1) {
            return deletedEnrollments[0].totalActiveEnrollments;
        }
    };

    getTotalDeletedEnrollments = async (careplanCode: string, tenantId: string): Promise<number> => {
        let query = Helper.replaceAll(queryTotalDeletedEnrollments,'{{careplanCode}}',careplanCode);
        query = Helper.replaceAll(query, '{{tenantId}}',tenantId);
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const activeEnrollments: any = rows;
        if (activeEnrollments.length === 1) {
            return activeEnrollments[0].totalDeletedEnrollments;
        }
    };
   
    getHealthSystemEnrollmentCount =
    async (careplanCode: string, healthSystem : string, tenantId: string): Promise<CareplanHealthSystem> => {
        let query = Helper.replaceAll(queryHealthSystemEnrollmentCount, '{{careplanCode}}', careplanCode);
        query = Helper.replaceAll(query, '{{healthSystem}}', healthSystem);
        query = Helper.replaceAll(query, '{{tenantId}}',tenantId);
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const healthSystemEnrollments: any = rows;
        if (healthSystemEnrollments.length === 1) {
            return {
                Careplan     : careplanCode,
                HealthSystem : healthSystem,
                Enrollments  : healthSystemEnrollments[0].count
            };
            
        }
    };

    getListOfCareplan = async (tenantId: string) => {
        const query =  Helper.replaceAll(queryCareplanList, "{{tenantId}}",tenantId);
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const careplans: any = rows;
        return this.extractCareplanCode(careplans);

    };

    getListOfHealthSystem = async () => {
        const query = queryListOfHealthSystem;
        const [rows] = await this.dbConnector._client.executeQuery(query);
        const healthSystems: any = rows;
        return this.extractHealthSystems(healthSystems);
    };
    
    private extractHealthSystems = (data) => {
        const healthSystems = [];
        data.forEach((healthSystem) => {
            healthSystems.push(healthSystem.Name);
        });
        return healthSystems;
    };

    private extractCareplanCode = (data) => {
        const careplans = [];
        data.forEach((careplan) => {
            careplans.push(careplan.PlanCode);
        });
        return careplans;
    };

}
