//Query to get the total patients
export const queryTotalPatients =  `SELECT COUNT(*) AS totalPatients FROM patients
                                    JOIN users ON users.id = patients.UserId
                                    WHERE 
                                        users.IsTestUser = false`;

//Query to get the total active patients
export const queryTotalActivePatients = `SELECT COUNT(distinct (patients.UserId)) AS totalActivePatients 
                                        FROM patients
                                        JOIN users ON patients.UserId = users.id
                                        WHERE 
                                            users.IsTestUser = false
                                            AND 
                                            users.DeletedAt IS null`;

//Query to get the total deleted patients
export const queryTotalDeletedPatients = `SELECT COUNT(distinct (patients.UserId)) AS totalDeletedPatients 
                                        FROM patients
                                        JOIN users ON patients.UserId = users.id
                                        WHERE 
                                            users.IsTestUser = false
                                            AND 
                                            users.DeletedAt IS NOT null`;

//Query to get the total users
export const queryTotalUsers = `SELECT COUNT(*) AS totalUsers 
                                FROM users 
                                WHERE 
                                    IsTestUser = false`;

//Query to get the total active users
export const queryTotalActiveUsers = `SELECT COUNT(*) AS totalActiveUsers 
                                    FROM users 
                                    WHERE 
                                        IsTestUser = false
                                        AND
                                        DeletedAt IS null`;

//Query to get the total deleted users
export const queryTotalDeletedUsers =  `SELECT COUNT(*) AS totalDeletedUsers 
                                        FROM users 
                                        WHERE 
                                            IsTestUser = false
                                            AND
                                            DeletedAt IS NOT null`;

//Query to get the total persons
export const queryTotalPersons = `SELECT COUNT(*) AS totalPersons FROM persons`;

//Query to get the total active persons
export const queryTotalActivePersons = `SELECT count(*) as totalActivePersons from persons
                                        WHERE 
                                            persons.DeletedAt IS null`;

//Query to get the total deleted persons
export const queryTotalDeletedPersons = `SELECT count(*) as totalDeletedPersons from persons
                                         WHERE 
                                            persons.DeletedAt IS NOT null`;

//Query to get the total doctors
export const queryTotalDoctors =    `SELECT COUNT(*) AS totalDoctors FROM doctors
                                    JOIN users ON users.id = doctors.UserId
                                    WHERE 
                                        users.IsTestUser = false`;

//Query to get the total active doctors
export const queryTotalActiveDoctors =  `SELECT COUNT(*) AS totalActiveDoctors FROM doctors
                                        JOIN users ON users.id = doctors.UserId
                                        WHERE 
                                            users.IsTestUser = false
                                            AND
                                            users.DeletedAt IS null`;

//Query to get the total deleted doctors
export const queryTotalDeletedDoctors = `SELECT COUNT(*) AS totalDeletedDoctors FROM doctors
                                        JOIN users ON users.id = doctors.UserId
                                        WHERE 
                                            users.IsTestUser = false
                                            AND
                                            users.DeletedAt IS NOT null`;

//Query to get the total users with missing device count
export const queryUsersWithMissingDeviceDetail =    `SELECT COUNT(*) AS count FROM users
                                                    WHERE 
                                                        users.IsTestUser = false
                                                        AND
                                                        id NOT IN 
                                                        (
                                                        SELECT UserId from user_device_details
                                                        )`;
                                                        
//Query to get the unique users in device details table
export const queryUniqueUsersInDeviceDetail =  `SELECT COUNT(distinct(UserId)) AS count FROM user_device_details
                                                JOIN users ON users.id = user_device_details.UserId
                                                WHERE 
                                                    users.IsTestUser = false`;
