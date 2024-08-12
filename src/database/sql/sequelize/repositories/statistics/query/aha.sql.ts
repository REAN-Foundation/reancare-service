//Query to get the list of careplans
export const queryCareplanList =   `SELECT DISTINCT(PlanCode)
                                    FROM careplan_enrollments
                                    JOIN users ON careplan_enrollments.PatientUserId = users.id
                                    WHERE 
                                        users.TenantId = "{{tenantId}}"`;

// Query to get total enrollments for the selected careplan
export const queryTotalEnrollments =   `SELECT COUNT(*) AS totalEnrollments
                                        FROM careplan_enrollments
                                        JOIN users ON careplan_enrollments.PatientUserId = users.id 
                                        WHERE 
                                            careplan_enrollments.PlanCode = '{{careplanCode}}'
                                            AND
                                            users.IsTestUser = false
                                            AND
                                            users.TenantId = "{{tenantId}}"`;

//Query to get the total active enrollments for the selected careplan
export const queryTotalActiveEnrollments = `SELECT COUNT(DISTINCT(careplan_enrollment.PatientUserId)) AS totalActiveEnrollments
                                            FROM careplan_enrollments as careplan_enrollment 
                                            WHERE careplan_enrollment.PlanCode = '{{careplanCode}}'
                                            AND careplan_enrollment.PatientUserId
                                                IN
                                                    (
                                                        SELECT DISTINCT (patient.UserId) 
                                                        FROM patients AS patient
                                                        JOIN users AS user ON patient.UserId = user.id
                                                        JOIN persons as person ON user.PersonId = person.id
                                                        WHERE 
                                                            user.IsTestUser = 0
                                                            AND
                                                            user.TenantId = "{{tenantId}}"
                                                            AND
                                                            person.DeletedAt IS null
                                                        )`;

// Query to get the total deleted enrollments for the selected careplan
export const queryTotalDeletedEnrollments = `SELECT COUNT(DISTINCT(careplan_enrollment.PatientUserId)) AS totalDeletedEnrollments
                                            FROM careplan_enrollments as careplan_enrollment 
                                            WHERE careplan_enrollment.PlanCode = '{{careplanCode}}'
                                                AND careplan_enrollment.PatientUserId
                                                    IN
                                                        (
                                                            SELECT DISTINCT (patient.UserId) 
                                                            FROM patients AS patient
                                                            JOIN users AS user ON patient.UserId = user.id
                                                                JOIN persons as person ON user.PersonId = person.id
                                                                WHERE 
                                                                user.IsTestUser = false
                                                                AND
                                                                user.TenantId = '{{tenantId}}'
                                                                AND
                                                                person.DeletedAt IS NOT null
                                                        )`;
                                                        
//Query to get the list of health systems
export const queryListOfHealthSystem = `SELECT DISTINCT(Name) FROM health_systems`;

// Query to get the total number of enrollments in a given care plan
export const queryHealthSystemEnrollmentCount = `SELECT COUNT(DISTINCT(careplan_enrollment.PatientUserId)) as count 
                                                FROM careplan_enrollments as careplan_enrollment 
                                                JOIN users as user ON careplan_enrollment.PatientUserId = user.id
                                                JOIN patients as patient ON user.id = patient.UserId
                                                JOIN persons as person ON user.PersonId = person.id
                                                WHERE careplan_enrollment.PlanCode = '{{careplanCode}}' 
                                                    AND careplan_enrollment.PatientUserId IN 
                                                        (
                                                            SELECT DISTINCT (user.id) from users as user
                                                            JOIN patients as patient on patient.UserId = user.id
                                                            WHERE 
                                                                user.IsTestUser = 0 
                                                                AND
                                                                user.TenantId = "{{tenantId}}"
                                                                AND
                                                                patient.HealthSystem = "{{healthSystem}}"
                                                        )`;

export const queryAhaTenant =  `SELECT id FROM tenants WHERE Code = "default"`;
