
export enum Roles {
    SystemAdmin          = 'System admin',
    SystemUser           = 'System user',
    Patient              = 'Patient',
    Doctor               = 'Doctor',
    LabUser              = 'Lab user',
    PharmacyUser         = 'Pharmacy user',
    Nurse                = 'Nurse',
    AmbulanceServiceUser = 'Ambulance service user',
    SocialHealthWorker   = 'Social health worker',
    PatientFamilyMember  = 'Patient family member',
    PatientFriend        = 'Patient friend',
    Donor                = 'Donor',
    Volunteer            = 'Volunteer',
    TenantAdmin          = 'Tenant admin',
    TenantUser           = 'Tenant user',
}

export const DefaultRoles = [
    {
        Role         : Roles.SystemAdmin,
        Description  : 'Admin of the system having elevated super-admin privileges.',
        IsSystemRole : true,
        IsUserRole   : true,
    },
    {
        Role         : Roles.SystemUser,
        Description  : 'User of the system having elevated privileges in select areas.',
        IsSystemRole : true,
        IsUserRole   : true,
    },
    {
        Role         : Roles.Patient,
        Description  : 'Represents a patient.',
        IsSystemRole : false,
        IsUserRole   : true,
    },
    {
        Role         : Roles.Doctor,
        Description  : 'Represents a doctor/physician.',
        IsSystemRole : false,
        IsUserRole   : true,
    },
    {
        Role         : Roles.LabUser,
        Description  : 'Represents a pathology/radiology lab representative/technician/pathologist/radiologist.',
        IsSystemRole : false,
        IsUserRole   : false,
    },
    {
        Role         : Roles.PharmacyUser,
        Description  : 'Represents a pharmacy/pharmacist/pharmacy shop owner/drug dispenser.',
        IsSystemRole : false,
        IsUserRole   : false,
    },
    {
        Role         : Roles.Nurse,
        Description  : 'Represents an nurse and medical care taker.',
        IsSystemRole : false,
        IsUserRole   : false,
    },
    {
        Role         : Roles.AmbulanceServiceUser,
        Description  : 'Represents an ambulance service provider/driver/mobile emergency medic.',
        IsSystemRole : false,
        IsUserRole   : false,
    },
    {
        Role         : Roles.SocialHealthWorker,
        Description  : 'Represents a health social worker/health support professional representing government/private health service.',
        IsSystemRole : false,
        IsUserRole   : false,
    },
    {
        Role         : Roles.PatientFamilyMember,
        Description  : 'Represents a family member of the patient.',
        IsSystemRole : false,
        IsUserRole   : false,
    },
    {
        Role         : Roles.PatientFriend,
        Description  : 'Represents a friend of the patient.',
        IsSystemRole : false,
        IsUserRole   : false,
    },
    {
        Role         : Roles.Donor,
        Description  : 'Represents a donor such as blood donor, organ donor, etc.',
        IsSystemRole : false,
        IsUserRole   : true,
    },
    {
        Role         : Roles.Volunteer,
        Description  : 'Represents a volunteer.',
        IsSystemRole : false,
        IsUserRole   : true,
    },
    {
        Role         : Roles.TenantAdmin,
        Description  : 'An admin specific to a tenant. Capable of managing a tenant.',
        IsSystemRole : false,
        IsUserRole   : true,
    },
    {
        Role         : Roles.TenantUser,
        Description  : 'A user specific to a tenant.',
        IsSystemRole : false,
        IsUserRole   : true,
    }

];

