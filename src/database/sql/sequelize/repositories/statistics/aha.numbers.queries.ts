
// Cholesterol Queries
export function getCholesterolActiveQuery(databaseName: string): string {
    return `
        select distinct (ce.PatientUserId), p.Phone, p.FirstName, p.LastName, p.DeletedAt, ce.StartDate, ce.EndDate, ce.CreatedAt 
        from ${databaseName}.careplan_enrollments as ce 
        JOIN users as u ON ce.PatientUserId = u.id
        JOIN persons as p ON u.PersonId = p.id
        where ce.PlanCode = "Cholesterol" 
        AND ce.PatientUserId IN 
        (
            SELECT distinct (id) from ${databaseName}.users
            WHERE IsTestUser = 0 AND DeletedAt is null
        )
    `;
}

export function getCholesterolDeletedQuery(databaseName: string): string {
    return `
        select distinct (ce.PatientUserId), p.Phone, p.FirstName, p.LastName, p.DeletedAt, ce.StartDate, ce.EndDate, ce.CreatedAt 
        from ${databaseName}.careplan_enrollments as ce 
        JOIN users as u ON ce.PatientUserId = u.id
        JOIN persons as p ON u.PersonId = p.id
        where ce.PlanCode = "Cholesterol" 
        AND ce.PatientUserId IN 
        (
            SELECT distinct (id) from ${databaseName}.users
            WHERE IsTestUser = 0 AND DeletedAt is not null
        )
    `;
}

// Stroke Queries
export function getStrokeActiveQuery(databaseName: string): string {
    return `
        select distinct (ce.PatientUserId), p.Phone, p.FirstName, p.LastName, p.DeletedAt, ce.StartDate, ce.EndDate, ce.CreatedAt 
        from ${databaseName}.careplan_enrollments as ce 
        JOIN users as u ON ce.PatientUserId = u.id
        JOIN persons as p ON u.PersonId = p.id
        where ce.PlanCode = "Stroke" 
        AND ce.PatientUserId IN 
        (
            SELECT distinct (id) from ${databaseName}.users
            WHERE IsTestUser = 0 AND DeletedAt is null
        )
    `;
}

export function getStrokeDeletedQuery(databaseName: string): string {
    return `
        select distinct (ce.PatientUserId), p.Phone, p.FirstName, p.LastName, p.DeletedAt, ce.StartDate, ce.EndDate, ce.CreatedAt 
        from ${databaseName}.careplan_enrollments as ce  
        JOIN users as u ON ce.PatientUserId = u.id
        JOIN persons as p ON u.PersonId = p.id
        where ce.PlanCode = "Stroke" 
        AND ce.PatientUserId IN 
        (
            SELECT distinct (id) from ${databaseName}.users
            WHERE IsTestUser = 0 AND DeletedAt is not null
        )
    `;
}

// Health System Queries
export function getWellstarCholesterolQuery(databaseName: string): string {
    return `
        select distinct (ce.PatientUserId), p.Phone, p.FirstName, p.LastName, ce.Plancode, ce.StartDate, ce.EndDate, pt.HealthSystem, pt.AssociatedHospital, p.DeletedAt 
        from ${databaseName}.careplan_enrollments as ce 
        JOIN users as u ON ce.PatientUserId = u.id
        JOIN patients as pt ON u.id = pt.UserId
        JOIN persons as p ON u.PersonId = p.id
        where ce.PlanCode = "Cholesterol" 
        AND ce.PatientUserId IN 
        (
            SELECT distinct (u.id) from ${databaseName}.users as u
            Join patients as pt on pt.UserId = u.id
            WHERE u.IsTestUser = 0 AND pt.HealthSystem = 'Wellstar Health System'
        )
    `;
}

export function getUCSanDiegoCholesterolQuery(databaseName: string): string {
    return `
        select distinct (ce.PatientUserId), p.Phone, p.FirstName, p.LastName, ce.Plancode, ce.StartDate, ce.EndDate, pt.HealthSystem, pt.AssociatedHospital, p.DeletedAt 
        from ${databaseName}.careplan_enrollments as ce 
        JOIN users as u ON ce.PatientUserId = u.id
        JOIN patients as pt ON u.id = pt.UserId
        JOIN persons as p ON u.PersonId = p.id
        where ce.PlanCode = "Cholesterol"
        AND ce.PatientUserId IN 
        (
            SELECT distinct (u.id) from ${databaseName}.users as u
            Join patients as pt on pt.UserId = u.id
            WHERE u.IsTestUser = 0 AND pt.HealthSystem = 'UC San Diego Health'
        )
    `;
}

export function getMHealthFairviewCholesterolQuery(databaseName: string): string {
    return `
        select distinct (ce.PatientUserId), p.Phone, p.FirstName, p.LastName, ce.Plancode, ce.StartDate, ce.EndDate, pt.HealthSystem, pt.AssociatedHospital, p.DeletedAt 
        from ${databaseName}.careplan_enrollments as ce 
        JOIN users as u ON ce.PatientUserId = u.id
        JOIN patients as pt ON u.id = pt.UserId
        JOIN persons as p ON u.PersonId = p.id
        where ce.PlanCode = "Cholesterol"
        AND ce.PatientUserId IN 
        (
            SELECT distinct (u.id) from ${databaseName}.users as u
            Join patients as pt on pt.UserId = u.id
            WHERE u.IsTestUser = 0 AND pt.HealthSystem = 'M Health Fairview'
        )
    `;
}

export function getAtriumHealthCholesterolQuery(databaseName: string): string {
    return `
        select distinct (ce.PatientUserId), p.Phone, p.FirstName, p.LastName, ce.Plancode, ce.StartDate, ce.EndDate, pt.HealthSystem, pt.AssociatedHospital, p.DeletedAt 
        from ${databaseName}.careplan_enrollments as ce 
        JOIN users as u ON ce.PatientUserId = u.id
        JOIN patients as pt ON u.id = pt.UserId
        JOIN persons as p ON u.PersonId = p.id
        where ce.PlanCode = "Cholesterol"
        AND ce.PatientUserId IN 
        (
            SELECT distinct (u.id) from ${databaseName}.users as u
            Join patients as pt on pt.UserId = u.id
            WHERE u.IsTestUser = 0 AND pt.HealthSystem = 'Atrium Health'
        )
    `;
}

export function getKaiserPermanenteCholesterolQuery(databaseName: string): string {
    return `
        select distinct (ce.PatientUserId), p.Phone, p.FirstName, p.LastName, ce.Plancode, ce.StartDate, ce.EndDate, pt.HealthSystem, pt.AssociatedHospital, p.DeletedAt 
        from ${databaseName}.careplan_enrollments as ce 
        JOIN users as u ON ce.PatientUserId = u.id
        JOIN patients as pt ON u.id = pt.UserId
        JOIN persons as p ON u.PersonId = p.id
        where ce.PlanCode = "Cholesterol"
        AND ce.PatientUserId IN 
        (
            SELECT distinct (u.id) from ${databaseName}.users as u
            Join patients as pt on pt.UserId = u.id
            WHERE u.IsTestUser = 0 AND pt.HealthSystem = 'Kaiser Permanente'
        )
    `;
}

export function getNebraskaHealthSystemCholesterolQuery(databaseName: string): string {
    return `
        select distinct (ce.PatientUserId), p.Phone, p.FirstName, p.LastName, ce.Plancode, ce.StartDate, ce.EndDate, pt.HealthSystem, pt.AssociatedHospital, p.DeletedAt 
        from ${databaseName}.careplan_enrollments as ce 
        JOIN users as u ON ce.PatientUserId = u.id
        JOIN patients as pt ON u.id = pt.UserId
        JOIN persons as p ON u.PersonId = p.id
        where ce.PlanCode = "Cholesterol" 
        AND ce.PatientUserId IN 
        (
            SELECT distinct (u.id) from ${databaseName}.users as u
            Join patients as pt on pt.UserId = u.id
            WHERE u.IsTestUser = 0 AND pt.HealthSystem = 'Nebraska Health System'
        )
    `;
}

export function getHCAHealthcareCholesterolQuery(databaseName: string): string {
    return `
        select distinct (ce.PatientUserId), p.Phone, p.FirstName, p.LastName, ce.Plancode, ce.StartDate, ce.EndDate, pt.HealthSystem, pt.AssociatedHospital, p.DeletedAt 
        from ${databaseName}.careplan_enrollments as ce 
        JOIN users as u ON ce.PatientUserId = u.id
        JOIN patients as pt ON u.id = pt.UserId
        JOIN persons as p ON u.PersonId = p.id
        where ce.PlanCode = "Stroke"
        AND ce.PatientUserId IN 
        (
            SELECT distinct (u.id) from ${databaseName}.users as u
            Join patients as pt on pt.UserId = u.id
            WHERE u.IsTestUser = 0 AND pt.HealthSystem = 'HCA Healthcare'
        )
    `;
}
