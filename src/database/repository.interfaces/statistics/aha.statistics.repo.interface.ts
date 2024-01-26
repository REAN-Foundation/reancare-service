import { AppName, CareplanCode, HealthSystem } from "../../../domain.types/statistics/aha/aha.type";

////////////////////////////////////////////////////////////////////
export interface IAhaStatisticsRepo {

    getTotalPatients(): Promise<number>;

    getTotalActivePatients(): Promise<number>;

    getTotalDeletedPatients(): Promise<number>;

    getTotalTestPatients(): Promise<number>;

    getTotalDeletedTestPatients(): Promise<number>;
    
    getTotalUsersWithMissingDeviceDetail(): Promise<number>;

    getTotalUniqueUsersInDeviceDetail(): Promise<number>;

    getAppSpecificTotalUsers(appName : AppName): Promise<number>;

    getTotalUsersLoggedToHSAndHF(): Promise<number>;

    getAppSpecificPatientHealthProfileData(appName : AppName): Promise<number>;

    getAppSpecificTotalPatients(appName : AppName): Promise<number>;

    getAppSpecificTotalPerson(appName : AppName): Promise<number>;

    getAppSpecificDailyAssessmentCount(appName : AppName): Promise<number>;

    getAppSpecificBodyWeightDataCount(appName : AppName): Promise<number>;

    getAppSpecificLabRecordCount(appName : AppName): Promise<number>;

    getAppSpecificMedicationConsumptionCount(appName : AppName): Promise<number>;

    getAppSpecificMedicationConsumptionCount(appName : AppName): Promise<number>;

    getAppSpecificCareplanActivityCount(appName : AppName): Promise<number>;

    getUserAssessmentCount(): Promise<number>;

    getTotalUsers(): Promise<number>;

    getTotalActiveUsers(): Promise<number>;

    getTotalDeletedUsers(): Promise<number>;

    getTotalTestUsers(): Promise<number>;

    getTotalDeletedTestUsers(): Promise<number>;

    getTotalPersons(): Promise<number>;

    getTotalActivePersons(): Promise<number>;

    getTotalDeletedPersons(): Promise<number>;

    getTotalTestPersons(): Promise<number>;

    getTotalDeletedTestPersons(): Promise<number>;

    getTotalDoctors(): Promise<number>;

    getTotalActiveDoctors(): Promise<number>;

    getTotalDeletedDoctors(): Promise<number>;

    getTotalTestDoctors(): Promise<number>;

    getTotalDeletedTestDoctors(): Promise<number>;

    getTotalCareplanEnrollments(): Promise<number>;

    getTotalEnrollments(careplanCode:CareplanCode): Promise<number>;

    getTotalActiveEnrollments(careplanCode:CareplanCode): Promise<number>;

    getTotalDeletedEnrollments(careplanCode:CareplanCode): Promise<number>;

    getTotalTestUsersForCareplanEnrollments(careplanCode:CareplanCode): Promise<number>;

    getTotalDeletedTestUsersForCareplanEnrollments(careplanCode:CareplanCode): Promise<number>;

    getHealthSystemEnrollmentCount(careplanCode:CareplanCode, healthSystem : HealthSystem): Promise<any>;

    getListOfCareplan(): Promise<any>;

    getListOfHealthSystem(): Promise<any>;
}
