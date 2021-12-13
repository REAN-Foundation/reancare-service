
//////////////////////////////////////////////////////////////////////

export enum EmergencyContactRoles {
    Doctor               = 'Doctor',
    SocialHealthWorker   = 'Social health worker',
    Nurse                = 'Nurse',
    AmbulanceServiceUser = 'Ambulance service user',
    PatientFamilyMember  = 'Patient family member',
    PatientFriend        = 'Patient friend',
    PharmacyUser         = 'Pharmacy user'
}

export const EmergencyContactRoleList: EmergencyContactRoles [] = [
    EmergencyContactRoles.Doctor,
    EmergencyContactRoles.SocialHealthWorker,
    EmergencyContactRoles.Nurse,
    EmergencyContactRoles.AmbulanceServiceUser,
    EmergencyContactRoles.PatientFamilyMember,
    EmergencyContactRoles.PatientFriend,
    EmergencyContactRoles.PharmacyUser,
];
