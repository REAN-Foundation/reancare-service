
////////////////////////////////////////////////////////////////////
export interface IAhaStatisticsRepo {

    getAhaStatistics();
    getTotalPatients();
    getUsersWithMissingDeviceDetails();
    getUniqueUsersInDeviceDetails();
    getHSUserCount();
    getUsersLoggedCountToHSAndHF();
}
