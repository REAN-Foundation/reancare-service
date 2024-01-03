import { CareplanCode } from "../../../domain.types/statistics/aha/aha.type";

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
    //////////////////////////////////////////
    getTotalHSUsers();
    getTotalUsersLoggedToHSAndHF();
    getHSpatientHealthProfileData();
    getTotalHSPatients();
    getTotalHSPerson();
    getHSDailyAssessmentCount();
    getHSBodyWeightDataCount();
    getHSLabRecordCount();
    getHSCareplanActivityCount();
    getHSMedicationConsumptionCount();
    ////////////////////////////////////////
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
