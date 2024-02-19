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
    
//Query to get the user count by device details
export const queryUsersByDeviceDetail =
`SELECT OSType, COUNT(*) as count
FROM user_device_details
WHERE UserId IN
    (
        SELECT id
        FROM users 
        WHERE IsTestUser = false
    )
GROUP BY OSType`;

export const queryAllYear =
`SELECT DISTINCT YEAR(CreatedAt) AS years
FROM persons
order by years asc`;

export const queryYearWiseUserCount =
`SELECT DISTINCT YEAR(CreatedAt) AS years, COUNT(*) AS totalUsers
FROM users
WHERE IsTestUser = false
GROUP BY years
ORDER BY years asc`;

export const queryYearWiseDeviceDetail =
`SELECT DISTINCT YEAR(CreatedAt) AS years, OSType, COUNT(*) AS totalUsers
FROM user_device_details
WHERE UserId IN 
    (
        SELECT id
        FROM users
        WHERE IsTestUser = false
    )
GROUP BY years, OSType
ORDER BY years asc`;

export const queryUserByAge =
`SELECT Age, COUNT(*) as totalCount
FROM persons
WHERE id IN 
    (
        SELECT PersonId
        FROM users
        WHERE IsTestUser = false
    )
GROUP BY Age`;

export const queryUserByGender =
`SELECT Gender, COUNT(*) as totalCount
FROM persons
WHERE id IN 
    (
        SELECT PersonId
        FROM users
        WHERE IsTestUser = false
    )
GROUP BY Gender`;

export const queryUserMarritalStatus =
`SELECT MaritalStatus, COUNT(*) as totalCount
FROM patient_health_profiles
WHERE PatientUserId IN 
    (
        SELECT id
        FROM reanadmintestdata4.users
        WHERE IsTestUser = false
    )
GROUP BY MaritalStatus`;

export const queryUserByMajorAilment =
`SELECT MajorAilment, COUNT(*) as totalCount
FROM patient_health_profiles
WHERE PatientUserId IN 
    (
        SELECT id
        FROM users
        WHERE IsTestUser = false
    )
GROUP BY MajorAilment`;

export const queryTobaccoSmokers =
`SELECT COUNT(*) AS tobaccoUserCount
FROM patient_health_profiles
WHERE TobaccoQuestionAns = true AND PatientUserId IN 
    (
        SELECT id
        FROM users
        WHERE IsTestUser = false
    )`;

export const queryYearWiseTobaccoSmokers =
`SELECT DISTINCT YEAR(CreatedAt) AS years, COUNT(*) AS tobaccoUserCount
FROM patient_health_profiles
WHERE TobaccoQuestionAns = true AND PatientUserId IN 
    (
        SELECT id
        FROM users
        WHERE IsTestUser = false
    )
GROUP BY years
ORDER BY years ASC`;

export const queryHeavyDrinkers =
`SELECT COUNT(*) AS drinkerUserCount
FROM patient_health_profiles
WHERE IsDrinker = true AND DrinkingSeverity = 'High' AND PatientUserId IN 
    (
        SELECT id
        FROM users
        WHERE IsTestUser = false
    );`;

export const queryYearWiseHeavyDrinkers =
`SELECT DISTINCT YEAR(CreatedAt) AS years, COUNT(*) AS drinkerUserCount
FROM patient_health_profiles
WHERE IsDrinker = true AND DrinkingSeverity = 'High' AND PatientUserId IN 
    (
        SELECT id
        FROM users
        WHERE IsTestUser = false
    )
GROUP BY years
ORDER BY years ASC`;

export const querySubstanceAbuse =
`SELECT COUNT(*) AS substanceAbuseUserCount
FROM patient_health_profiles
WHERE SubstanceAbuse = true AND PatientUserId IN 
    (
        SELECT id
        FROM users
        WHERE IsTestUser = false
    )`;

export const queryYearWiseSubstanceAbuse =
`SELECT DISTINCT YEAR(CreatedAt) AS years, COUNT(*) AS substanceAbuseUserCount
FROM patient_health_profiles
WHERE SubstanceAbuse = true AND PatientUserId IN 
    (
        SELECT id
        FROM users
        WHERE IsTestUser = false
    )
GROUP BY years
ORDER BY years ASC`;

export const queryNotAddited =
`SELECT COUNT(*) AS notAddedUserCount
FROM patient_health_profiles
WHERE 
    (SubstanceAbuse = false AND IsDrinker = false AND (TobaccoQuestionAns = false OR TobaccoQuestionAns = null))
    AND
    PatientUserId IN 
    (
        SELECT id
        FROM users
        WHERE IsTestUser = false
    )`;

export const queryYearWiseNotAddited =
`SELECT DISTINCT YEAR(CreatedAt) as years, COUNT(*) AS notAddedUserCount
FROM patient_health_profiles
WHERE 
    (SubstanceAbuse = false AND IsDrinker = false AND (TobaccoQuestionAns = false OR TobaccoQuestionAns = null))
    AND
    PatientUserId IN 
        (
            SELECT id
            FROM users
            WHERE IsTestUser = false
        )
GROUP BY years
ORDER BY years ASC`;

export const queryYearWiseGenderDetails =
`SELECT DISTINCT YEAR(CreatedAt) AS years , Gender, COUNT(*) as totalCount
FROM persons
WHERE id IN 
    (
        SELECT PersonId
        FROM users
        WHERE IsTestUser = false
    )
GROUP BY years, Gender
ORDER BY years asc`;

export const queryYearWiseMaritalDetails =
`SELECT  DISTINCT YEAR(CreatedAt) AS years,  MaritalStatus, COUNT(*) as totalCount
FROM patient_health_profiles
WHERE PatientUserId IN 
    (
        SELECT id
        FROM users
        WHERE IsTestUser = false
    )
GROUP BY years, MaritalStatus
ORDER BY years asc`;

export const queryYearWiseMajorAilmentDistributionDetails =
`SELECT DISTINCT YEAR(CreatedAt) as years, MajorAilment, COUNT(*) as totalCount
FROM patient_health_profiles
WHERE PatientUserId IN 
    (
        SELECT id
        FROM users
        WHERE IsTestUser = false
    )
GROUP BY years, MajorAilment
ORDER BY years ASC`;
