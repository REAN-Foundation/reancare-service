
export interface RoleDTO {
    id: number;
    RoleName: string;
}

export enum Roles {
    Patient = 'Patient',
    Doctor = 'Doctor',
    LabUser = 'LabUser',
    PharmacyUser = 'PharmacyUser',
    SocialHealthWorker = 'SocialHealthWorker',
    PatientFamilyMember = 'PatientFamilyMember',
    PatientFriend = 'PatientFriend',
    AmbulanceService = 'AmbulanceService',
    SystemAdmin = 'SystemAdmin'
}

export interface UserRoleDTO {
    id: string,
    UserId: string;
    RoleId: number;
    RoleName: string;
}
