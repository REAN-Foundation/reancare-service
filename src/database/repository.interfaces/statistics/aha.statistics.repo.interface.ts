import { CareplanCode, HealthSystem } from "../../../domain.types/statistics/aha/aha.type";

////////////////////////////////////////////////////////////////////
export interface IAhaStatisticsRepo {

    getTotalPatients(): Promise<number>;

    getTotalActivePatients(): Promise<number>;

    getTotalDeletedPatients(): Promise<number>;
    
    getTotalUsersWithMissingDeviceDetail(): Promise<number>;

    getTotalUniqueUsersInDeviceDetail(): Promise<number>;

    getTotalUsers(): Promise<number>;

    getTotalActiveUsers(): Promise<number>;

    getTotalDeletedUsers(): Promise<number>;

    getTotalPersons(): Promise<number>;

    getTotalActivePersons(): Promise<number>;

    getTotalDeletedPersons(): Promise<number>;

    getTotalDoctors(): Promise<number>;

    getTotalActiveDoctors(): Promise<number>;

    getTotalDeletedDoctors(): Promise<number>;

    getTotalEnrollments(careplanCode: string, tenantId: string): Promise<number>;

    getTotalActiveEnrollments(careplanCode: string, tenantId: string): Promise<number>;

    getTotalDeletedEnrollments(careplanCode: string, tenantId: string): Promise<number>;

    getHealthSystemEnrollmentCount(careplanCode: any, healthSystem : string, tenantId: string): Promise<any>;

    getListOfCareplan(tenantId: string): Promise<any>;

    getListOfHealthSystem(): Promise<any>;

    getAhaTenant(): Promise<string>;
}
