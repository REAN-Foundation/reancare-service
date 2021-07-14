
export interface RoleDto {
    id: number;
    RoleName: string;
}

export enum Roles {
    Patient = 'Patient',
    Doctor = 'Doctor',
    LabUser = 'LabUser',
    PharmacyUser = 'PharmacyUser',
    Nurse = 'Nurse',
    AmbulanceServiceUser = 'AmbulanceServiceUser',
    SocialHealthWorker = 'SocialHealthWorker',
    PatientFamilyMember = 'PatientFamilyMember',
    PatientFriend = 'PatientFriend',
    SystemAdmin = 'SystemAdmin'
}

export interface PersonRoleDto {
    id: string,
    PersonId: string;
    RoleId: number;
    RoleName: string;
}

export interface RolePrivilegeDto {
    id: string,
    RoleId: number;
    Privilege: string;
}

