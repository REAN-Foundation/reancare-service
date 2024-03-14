//Query to get the total patients
export const queryTotalTenantPatients =    `SELECT COUNT(*) AS totalPatients FROM patients
                                            JOIN users ON users.id = patients.UserId
                                            WHERE 
                                                users.IsTestUser = false
                                                AND
                                                users.TenantId = "{{tenantId}}"`;

//Query to get the total active patients
export const queryTotalActiveTenantPatients =  `SELECT COUNT(distinct (patients.UserId)) AS totalActivePatients 
                                                FROM patients
                                                JOIN users ON patients.UserId = users.id
                                                WHERE 
                                                    users.IsTestUser = false
                                                    AND 
                                                    users.TenantId = "{{tenantId}}"
                                                    AND                                                    
                                                    users.DeletedAt IS null`;

//Query to get the total deleted patients
export const queryTotalDeletedTenantPatients = `SELECT COUNT(distinct (patients.UserId)) AS totalDeletedPatients 
                                                FROM patients
                                                JOIN users ON patients.UserId = users.id
                                                WHERE 
                                                    users.IsTestUser = false
                                                    AND
                                                    users.TenantId = "{{tenantId}}"
                                                    AND
                                                    users.DeletedAt IS NOT null`;

//Query to get the total users
export const queryTotalTenantUsers =    `SELECT COUNT(*) AS totalUsers 
                                        FROM users 
                                        WHERE 
                                            IsTestUser = false
                                            AND
                                            TenantId = "{{tenantId}}"`;

//Query to get the total active users
export const queryTotalActiveTenantUsers = `SELECT COUNT(*) AS totalActiveUsers 
                                            FROM users 
                                            WHERE 
                                                IsTestUser = false
                                                AND
                                                TenantId = "{{tenantId}}"
                                                AND
                                                DeletedAt IS null`;

//Query to get the total deleted users
export const queryTotalDeletedTenantUsers = `SELECT COUNT(*) AS totalDeletedUsers 
                                            FROM users 
                                            WHERE 
                                                IsTestUser = false
                                                AND
                                                TenantId = "{{tenantId}}"
                                                AND
                                                DeletedAt IS NOT null`;

//Query to get the total persons
export const queryTotalTenantPersons = `SELECT COUNT(*) AS totalPersons FROM persons
                                        JOIN users ON users.PersonId = persons.id
                                        WHERE
                                            users.IsTestUser = false
                                            AND
                                            users.TenantId = "{{tenantId}}"`;

//Query to get the total active persons
export const queryTotalActiveTenantPersons =    `SELECT count(*) as totalActivePersons from persons
                                                JOIN users ON users.PersonId = persons.id
                                                WHERE
                                                    users.IsTestUser = false
                                                    AND
                                                    users.TenantId = "{{tenantId}}"
                                                    AND
                                                    persons.DeletedAt IS null`;

//Query to get the total deleted persons
export const queryTotalDeletedTenantPersons =  `SELECT count(*) as totalDeletedPersons from persons
                                                JOIN users ON users.PersonId = persons.id
                                                WHERE
                                                    users.IsTestUser = false
                                                    AND
                                                    users.TenantId = "{{tenantId}}"
                                                    AND
                                                    persons.DeletedAt IS NOT null`;

//Query to get the total doctors
export const queryTotalTenantDoctors =  `SELECT COUNT(*) AS totalDoctors FROM doctors
                                        JOIN users ON users.id = doctors.UserId
                                        WHERE 
                                            users.IsTestUser = false
                                            AND
                                            users.TenantId = "{{tenantId}}"`;

//Query to get the total active doctors
export const queryTotalActiveTenantDoctors =    `SELECT COUNT(*) AS totalActiveDoctors FROM doctors
                                                JOIN users ON users.id = doctors.UserId
                                                WHERE 
                                                    users.IsTestUser = false
                                                    AND
                                                    users.TenantId = "{{tenantId}}"
                                                    AND
                                                    users.DeletedAt IS null`;

//Query to get the total deleted doctors
export const queryTotalDeletedTenantDoctors =   `SELECT COUNT(*) AS totalDeletedDoctors FROM doctors
                                                JOIN users ON users.id = doctors.UserId
                                                WHERE 
                                                    users.IsTestUser = false
                                                    AND
                                                    users.TenantId = "{{tenantId}}"
                                                    AND
                                                    users.DeletedAt IS NOT null`;

//Query to get the total users with missing device count
export const queryTenantUsersWithMissingDeviceDetail = `SELECT COUNT(*) AS count FROM users
                                                        WHERE 
                                                            users.IsTestUser = false
                                                            AND
                                                            users.TenantId = "{{tenantId}}"
                                                            AND
                                                            id NOT IN 
                                                            (
                                                            SELECT UserId from user_device_details
                                                            )`;
                                                            
//Query to get the unique users in device details table
export const queryUniqueTenantUsersInDeviceDetail = `SELECT COUNT(distinct(UserId)) AS count FROM user_device_details
                                                    JOIN users ON users.id = user_device_details.UserId
                                                    WHERE 
                                                        users.IsTestUser = false
                                                        AND
                                                        users.TenantId = "{{tenantId}}"`;
