
// Query to get the total number of enrollments in a given care plan
export const queryHealthSystemEnrollmentCount =  
`select distinct (ce.PatientUserId), 
    p.Phone, 
    p.FirstName, 
    p.LastName, 
    ce.Plancode, 
    ce.StartDate,
    ce.EndDate, 
    pt.HealthSystem, 
    pt.AssociatedHospital, 
    p.DeletedAt 
from careplan_enrollments as ce 
JOIN users as u ON ce.PatientUserId = u.id
JOIN patients as pt ON u.id = pt.UserId
JOIN persons as p ON u.PersonId = p.id
    where ce.PlanCode = "{{careplanCode}}" AND ce.PatientUserId IN
    (
        SELECT distinct (u.id) from users as u
        Join patients as pt on pt.UserId = u.id
        WHERE u.IsTestUser = 0 AND pt.HealthSystem = '{{healthSystem}}'
    )`
;

