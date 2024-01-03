import { AppName, CareplanCode } from "../../../domain.types/statistics/aha/aha.type";

////////////////////////////////////////////////////////////////////
export interface IAhaStatisticsRepo {

    // getAhaStatistics();
    /////////////////////////////
    getTotalPatients();
    getTotalActivePatients();
    getTotalDeletedPatients();
    getTotalTestPatients();
    getTotalDeletedTestPatients();
    /////////////////////////////////////////
    getTotalUsersWithMissingDeviceDetail();
    getTotalUniqueUsersInDeviceDetail();
    //////////////////////////////////////////////////////////////////
    // getTotalHSUsers();
    getAppSpecificTotalUsers(appName : AppName);
    getTotalUsersLoggedToHSAndHF();
    // getHSpatientHealthProfileData();
    getAppSpecificpatientHealthProfileData(appName : AppName);
    // getTotalHSPatients();
    getAppSpecificTotalPatients(appName : AppName);
    // getTotalHSPerson();
    getAppSpecificTotalPerson(appName : AppName);
    // getHSDailyAssessmentCount();
    getAppSpecificDailyAssessmentCount(appName : AppName);
    // getHSBodyWeightDataCount();
    getAppSpecificBodyWeightDataCount(appName : AppName);
    // getHSLabRecordCount();
    getAppSpecificLabRecordCount(appName : AppName);
    // getHSCareplanActivityCount();
    getAppSpecificMedicationConsumptionCount(appName : AppName);
    // getHSMedicationConsumptionCount();
    getAppSpecificMedicationConsumptionCount(appName : AppName);
    getAppSpecificCareplanActivityCount(appName : AppName)
    ///////////////////////////////////////////////////////////////////
    getUserAssessmentCount();
    //////////////////////////////
    getTotalUsers();
    getTotalActiveUsers();
    getTotalDeletedUsers();
    getTotalTestUsers();
    getTotalDeletedTestUsers();
    ////////////////////////////////
    getTotalPersons();
    getTotalActivePersons();
    getTotalDeletedPersons();
    getTotalTestPersons();
    getTotalDeletedTestPersons();
    /////////////////////////////////
    getTotalDoctors();
    getTotalActiveDoctors();
    getTotalDeletedDoctors();
    getTotalTestDoctors();
    getTotalDeletedTestDoctors();
    /////////////////////////////////
    getTotalCareplanEnrollments();
    getTotalEnrollments(careplanCode:CareplanCode);
    getTotalActiveEnrollments(careplanCode:CareplanCode);
    getTotalDeletedEnrollments(careplanCode:CareplanCode);
    getTotalTestUsersForCareplanEnrollments(careplanCode:CareplanCode);
    getTotalDeletedTestUsersForCareplanEnrollments(careplanCode:CareplanCode);
}
