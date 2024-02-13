//Query to get the total user count
export const queryTotalOnboardedUsers =
`SELECT COUNT(*) AS totalUsers 
FROM users 
WHERE IsTestUser = false`;

//Query to get the total not deleted user count
export const queryNotDeletedUsers =
`SELECT COUNT(*) AS totalNotDeletedUsers
FROM users 
WHERE IsTestUser = false AND DeletedAt IS null`;

//Query to get the total deleted user count
export const queryDeletedUsers =
`SELECT COUNT(*) AS totalDeletedUsers
FROM users 
WHERE IsTestUser = false AND DeletedAt IS NOT null`;

//Query to get the total users with active session
export const queryUsersWithActiveSession =
`SELECT COUNT(*) AS totalUsersWithActiveSession
FROM user_login_sessions
where ValidTill > NOW() AND UserId IN 
    (
    SELECT id 
    FROM users 
    WHERE IsTestUser= false AND DeletedAt is null
    )`;

//Query to get the total careplan enrollment count
export const getTotalCareplanEnrollments =
`SELECT COUNT(*) AS totalCareplanEnrollments
FROM careplan_enrollments
WHERE PatientUserId IN 
    (
        SELECT id 
        FROM users 
        WHERE IsTestUser= false
    )`;
