//Query to get the list of careplans
export const queryCareplanList =
`SELECT DISTINCT(PlanCode)
FROM careplan_enrollments`;

// Query to get total enrollments for the selected careplan
export const queryTotalEnrollments =
`SELECT COUNT(*) AS totalEnrollments
FROM careplan_enrollments 
WHERE PlanCode = '{{careplanCode}}'`;

//Query to get the total active enrollments for the selected careplan
export const queryTotalActiveEnrollments =
`SELECT COUNT(DISTINCT(careplan_enrollment.PatientUserId)) AS totalActiveEnrollments
FROM careplan_enrollments as careplan_enrollment 
WHERE careplan_enrollment.PlanCode = '{{careplanCode}}'
    AND careplan_enrollment.PatientUserId
        IN
            (
                SELECT DISTINCT (patient.UserId) 
                FROM patients AS patient
                JOIN users AS user ON patient.UserId = user.id
                WHERE user.IsTestUser = 0
                    JOIN persons as person ON user.PersonId = patient.id
                    WHERE person.DeletedAt IS null
            )`;

// Query to get the total deleted enrollments for the selected careplan
export const queryTotalDeletedEnrollments =
`SELECT COUNT(DISTINCT(careplan_enrollment.PatientUserId)) AS totalActiveEnrollments
FROM careplan_enrollments as careplan_enrollment 
WHERE careplan_enrollment.PlanCode = '{{careplanCode}}'
    AND careplan_enrollment.PatientUserId
        IN
            (
                SELECT DISTINCT (patient.UserId) 
                FROM patients AS patient
                JOIN users AS user ON patient.UserId = user.id
                WHERE user.IsTestUser = 0
                    JOIN persons as person ON user.PersonId = patient.id
                    WHERE person.DeletedAt IS null
            )`;
            
//Query to get the list of health systems
export const queryListOfHealthSystem =
`SELECT DISTINCT(HealthSystem) 
FROM patients`;

// Query to get the total number of enrollments in a given care plan
export const queryHealthSystemEnrollmentCount =
`SELECT COUNT(DISTINCT(careplan_enrollment.PatientUserId)) as count, 
FROM careplan_enrollments as careplan_enrollment 
JOIN users as user ON careplan_enrollment.PatientUserId = user.id
    JOIN patients as patient ON user.id = patient.UserId
        JOIN persons as person ON user.PersonId = patient.id
        WHERE careplan_enrollment.PlanCode = '{{careplanCode}}' 
            AND careplan_enrollment.PatientUserId IN 
                (
                    SELECT DISTINCT (user.id) from users as user
                    JOIN patients as patient on patient.UserId = user.id
                    WHERE user.IsTestUser = 0 AND patient.HealthSystem = '{{healthSystem}}'
                )`;

