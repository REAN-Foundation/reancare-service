//Query to get the total user count
export const queryTotalOnboardedTenantUsers =  `SELECT COUNT(*) AS totalUsers 
                                                FROM users 
                                                WHERE 
                                                    IsTestUser = false 
                                                    AND 
                                                    TenantId = "{{tenantId}}"`;

//Query to get the total not deleted user count
export const queryNotDeletedTenantUsers =  `SELECT COUNT(*) AS totalNotDeletedUsers
                                            FROM users 
                                            WHERE 
                                                IsTestUser = false
                                                AND 
                                                DeletedAt IS null 
                                                AND 
                                                TenantId = "{{tenantId}}"`;

//Query to get the total deleted user count
export const queryDeletedTenantUsers = `SELECT COUNT(*) AS totalDeletedUsers
                                        FROM users 
                                        WHERE 
                                            IsTestUser = false 
                                            AND DeletedAt IS NOT null
                                            AND
                                            TenantId = "{{tenantId}}"`;

//Query to get the total users with active session
export const queryTenantUsersWithActiveSession =    `SELECT COUNT(DISTINCT(user_login_sessions.UserId)) AS totalUsersWithActiveSession
                                                    FROM user_login_sessions
                                                    JOIN users ON user_login_sessions.UserId = users.id
                                                    where 
                                                        user_login_sessions.ValidTill > NOW()
                                                        AND
                                                        users.IsTestUser = false
                                                        AND
                                                        users.TenantId = "{{tenantId}}"`;
                                                
//Query to get the total careplan enrollment count
export const queryTenantUsersCareplanEnrollments =    `SELECT COUNT(*) AS totalCareplanEnrollments
                                                    FROM careplan_enrollments
                                                    JOIN users ON careplan_enrollments.PatientUserId = users.id
                                                    WHERE 
                                                        users.IsTestUser= false
                                                        AND
                                                        users.TenantId = "{{tenantId}}"`;
    
//Query to get the user count by device details for tenant
export const queryTenantUsersByDeviceDetail =  `SELECT OSType, COUNT(*) as Count
                                                FROM user_device_details
                                                JOIN users ON user_device_details.UserId = users.id
                                                WHERE 
                                                    users.IsTestUser = false
                                                    AND
                                                    users.TenantId = "{{tenantId}}"
                                                GROUP BY OSType`;

// Query to get app download count by app name
export const queryTenantAppDownloadCount = `SELECT AppName, TotalDownloads, IOSDownloads, AndroidDownloads
                                            FROM statistics_app_downloads
                                            WHERE
                                                statistics_app_downloads.AppName = "{{appName}}"`;
// Query to get all years
export const queryTenantAllYear =  `SELECT DISTINCT YEAR(CreatedAt) AS year
                                    FROM persons
                                    order by year asc`;
// Query to get year wise user count for tenant using tenant id
export const queryYearWiseTenantUserCount = `SELECT DISTINCT YEAR(CreatedAt) AS year, COUNT(*) AS totalUsers
                                            FROM users
                                            WHERE 
                                                IsTestUser = false
                                                AND
                                                TenantId = "{{tenantId}}"
                                            GROUP BY year
                                            ORDER BY year asc`;
// Query to get year wise device details for perticular tenant
export const queryYearWiseTenantUserDeviceDetail =  `SELECT DISTINCT YEAR(user_device_details.CreatedAt) AS year, OSType, COUNT(*) AS totalUsers
                                                    FROM user_device_details
                                                    JOIN users ON user_device_details.UserId = users.id
                                                    WHERE 
                                                        users.IsTestUser = false
                                                        AND 
                                                        users.TenantId = "{{tenantId}}"
                                                    GROUP BY year, OSType
                                                    ORDER BY year asc`;
// Query to get user age information for perticular tenant
export const queryTenantUserByAge = `SELECT TIMESTAMPDIFF(YEAR, BirthDate, CURDATE()) AS age
                                    FROM persons
                                    JOIN users ON persons.id = users.PersonId
                                    WHERE 
                                        users.IsTestUser = false
                                        AND
                                        users.TenantId = "{{tenantId}}"
                                    ORDER BY age ASC`;
// Query to get year wise user age details for perticular tenant
export const queryYearWiseTenantUserAge =  `SELECT TIMESTAMPDIFF(YEAR, BirthDate, CURDATE()) AS age
                                            FROM persons
                                            JOIN users ON persons.id = users.PersonId
                                            WHERE 
                                                users.IsTestUser = false 
                                                AND 
                                                YEAR(persons.CreatedAt) = "{{year}}"
                                                AND
                                                users.TenantId = "{{tenantId}}"
                                            ORDER BY age ASC`;
// Query to get user gender information for perticular tenant
export const queryTenantUserByGender =  `SELECT Gender, COUNT(*) as totalCount
                                        FROM persons
                                        JOIN users ON persons.id = users.PersonId
                                        WHERE
                                            users.IsTestUser = false
                                            AND
                                            users.TenantId = "{{tenantId}}"
                                        GROUP BY Gender`;
// Query to get user marrital status information for perticular tenant
export const queryTenantUserMarritalStatus =    `SELECT MaritalStatus, COUNT(*) AS Count
                                                FROM patient_health_profiles
                                                JOIN users ON patient_health_profiles.PatientUserId = users.id
                                                WHERE
                                                    users.IsTestUser = false
                                                    AND
                                                    users.TenantId = "{{tenantId}}"
                                                GROUP BY MaritalStatus`;
// Query to get user major ailment information for perticular tenant
export const queryTenantUserByMajorAilment =    `SELECT MajorAilment, COUNT(*) as Count
                                                FROM patient_health_profiles
                                                JOIN users ON patient_health_profiles.PatientUserId = users.id
                                                WHERE 
                                                    users.IsTestUser = false
                                                    AND
                                                    users.TenantId = "{{tenantId}}"
                                                GROUP BY MajorAilment`;
// Query to get tobacco smoker user information for perticular tenant
export const queryTobaccoSmokersTenantUser =    `SELECT COUNT(*) AS tobaccoUserCount
                                                FROM patient_health_profiles
                                                JOIN users ON patient_health_profiles.PatientUserId = users.id
                                                WHERE
                                                    patient_health_profiles.TobaccoQuestionAns = true
                                                    AND
                                                    users.IsTestUser = false
                                                    AND
                                                    users.TenantId = "{{tenantId}}"`;
// Query to get year wise tobacco smoker user information for perticular tenant
export const queryYearWiseTobaccoSmokersTenantUser =    `SELECT DISTINCT YEAR(patient_health_profiles.CreatedAt) AS year, COUNT(*) AS tobaccoUserCount
                                                        FROM patient_health_profiles
                                                        JOIN users ON patient_health_profiles.PatientUserId = users.id
                                                        WHERE
                                                            patient_health_profiles.TobaccoQuestionAns = true
                                                            AND
                                                            users.IsTestUser = false
                                                            AND
                                                            users.TenantId = "{{tenantId}}"
                                                        GROUP BY year
                                                        ORDER BY year ASC`;
// Query to get heavy drinker user information for perticular tenant
export const queryHeavyDrinkersTenantUser = `SELECT COUNT(*) AS drinkerUserCount
                                            FROM patient_health_profiles
                                            JOIN users ON patient_health_profiles.PatientUserId = users.id
                                            WHERE 
                                                patient_health_profiles.IsDrinker = true 
                                                AND 
                                                patient_health_profiles.DrinkingSeverity = 'High' 
                                                AND
                                                users.IsTestUser = false
                                                AND
                                                users.TenantId = "{{tenantId}}"`;
// Query to get year wise heavy drinker user information for perticular tenant
export const queryYearWiseHeavyDrinkersTenantUser = `SELECT DISTINCT YEAR(patient_health_profiles.CreatedAt) AS year, COUNT(*) AS drinkerUserCount
                                                    FROM patient_health_profiles
                                                    JOIN users ON patient_health_profiles.PatientUserId = users.id
                                                    WHERE 
                                                        patient_health_profiles.IsDrinker = true 
                                                        AND 
                                                        patient_health_profiles.DrinkingSeverity = 'High' 
                                                        AND 
                                                        users.IsTestUser = false
                                                        AND
                                                        users.TenantId = "{{tenantId}}"
                                                    GROUP BY year
                                                    ORDER BY year ASC`;
// Query to get substance abuse user information for perticular tenant
export const querySubstanceAbuseTenantUser =    `SELECT COUNT(*) AS substanceAbuseUserCount
                                                FROM patient_health_profiles
                                                JOIN users ON patient_health_profiles.PatientUserId = users.id
                                                WHERE 
                                                    patient_health_profiles.SubstanceAbuse = true 
                                                    AND 
                                                    users.IsTestUser = false
                                                    AND
                                                    users.TenantId = "{{tenantId}}"`;
// Query to get year wise substance abuse user information for perticular tenant
export const queryYearWiseSubstanceAbuseTenantUser =    `SELECT DISTINCT YEAR(patient_health_profiles.CreatedAt) AS year, COUNT(*) AS substanceAbuseUserCount
                                                        FROM patient_health_profiles
                                                        JOIN users ON patient_health_profiles.PatientUserId = users.id
                                                        WHERE 
                                                            patient_health_profiles.SubstanceAbuse = true 
                                                            AND 
                                                            users.IsTestUser = false
                                                            AND
                                                            users.TenantId = "{{tenantId}}"
                                                        GROUP BY year
                                                        ORDER BY year ASC`;
// Query to get not addited user information for perticular tenant
export const queryNotAddictedTenantUser =   `SELECT COUNT(*) AS notAddedUserCount
                                            FROM patient_health_profiles
                                            JOIN users ON patient_health_profiles.PatientUserId = users.id
                                            WHERE 
                                            (patient_health_profiles.SubstanceAbuse = false AND patient_health_profiles.IsDrinker = false AND (patient_health_profiles.TobaccoQuestionAns = false OR patient_health_profiles.TobaccoQuestionAns = null))
                                            AND
                                            users.IsTestUser = false
                                            AND
                                            users.TenantId = "{{tenantId}}"`;
// Query to get year wise not addited user information for perticular tenant
export const queryYearWiseNotAddictedTenantUser =   `SELECT DISTINCT YEAR(patient_health_profiles.CreatedAt) as year, COUNT(*) AS notAddedUserCount
                                                    FROM patient_health_profiles
                                                    JOIN users ON patient_health_profiles.PatientUserId = users.id
                                                    WHERE 
                                                        (patient_health_profiles.SubstanceAbuse = false AND patient_health_profiles.IsDrinker = false AND (patient_health_profiles.TobaccoQuestionAns = false OR patient_health_profiles.TobaccoQuestionAns = null))
                                                        AND
                                                        users.IsTestUser = false
                                                        AND
                                                        users.TenantId = "{{tenantId}}"
                                                    GROUP BY year
                                                    ORDER BY year ASC`;
// Query to get year wise user gender information for perticular tenant
export const queryYearWiseTenantUserGenderDetails = `SELECT DISTINCT YEAR(persons.CreatedAt) AS year , Gender, COUNT(*) as totalCount
                                                    FROM persons
                                                    JOIN users ON persons.id = users.PersonId
                                                    WHERE 
                                                        users.IsTestUser = false
                                                        AND
                                                        users.TenantId = "{{tenantId}}"
                                                    GROUP BY year, Gender
                                                    ORDER BY year asc`;
// Query to get year wise user marital information for perticular tenant
export const queryYearWiseTenantUserMaritalDetails =    `SELECT  DISTINCT YEAR(patient_health_profiles.CreatedAt) AS year,  MaritalStatus, COUNT(*) as totalCount
                                                        FROM patient_health_profiles
                                                        JOIN users ON patient_health_profiles.PatientUserId = users.id
                                                        WHERE 
                                                            users.IsTestUser = false
                                                            AND
                                                            users.TenantId = "{{tenantId}}"
                                                        GROUP BY year, MaritalStatus
                                                        ORDER BY year asc`;
// Query to get year wise user  major ailment information for perticular tenant
export const queryYearWiseTenantUserMajorAilmentDetails =   `SELECT DISTINCT YEAR(patient_health_profiles.CreatedAt) as year, MajorAilment, COUNT(*) as totalCount
                                                            FROM patient_health_profiles
                                                            JOIN users ON patient_health_profiles.PatientUserId = users.id
                                                            WHERE 
                                                                users.IsTestUser = false
                                                                AND
                                                                users.TenantId = "{{tenantId}}"
                                                            GROUP BY year, MajorAilment
                                                            ORDER BY year ASC`;
//query to get all tenant information
export const queryAllTenants = `SELECT DISTINCT(tenants.id) 
                                FROM tenants
                                JOIN users ON tenants.id = users.TenantId
                                WHERE
                                    users.RoleId != 1`;
