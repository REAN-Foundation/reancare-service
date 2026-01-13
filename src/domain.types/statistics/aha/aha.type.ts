import { uuid } from "../../miscellaneous/system.types";

export enum CareplanCode {
    Cholesterol = 'Cholesterol',
    Stroke = 'Stroke',
    CholesterolMini = 'CholesterolMini',
    HeartFailure = 'HeartFailure'
}

export enum AppName {
   HS = 'Heart &amp; Stroke Helper™',
   HF = 'HF Helper',
   REANHealthGuru = 'REAN HealthGuru',
   HeartAndStrokeHelper = 'Heart & Stroke Helper',
}

export enum HealthSystem {
    WellstarHealthSystem = 'Wellstar Health System',
    UCSanDiegoHealth = 'UC San Diego Health',
    AtriumHealth = 'Atrium Health',
    MHealthFairview = 'M Health Fairview',
    KaiserPermanente = 'Kaiser Permanente',
    NebraskaHealthSystem = 'Nebraska Health System',
    HCAHealthcare = 'HCA Healthcare'
}

export interface CareplanStats {
    Careplan: string,
    Enrollments: number,
    ActiveEnrollments: number,
    DeletedEnrollments: number
}

export interface CareplanHealthSystem {
    Careplan: string,
    HealthSystem: string,
    Enrollments: number,
}

export interface AhaEnrollmentBase extends CareplanHealthSystem {
    PatientUserId: uuid;
    Phone: string;
    FirstName: string;
    LastName: string;
    DeletedAt: Date | null;
    StartDate: Date;
    EndDate: Date | null;
    CreatedAt: Date;
}

export interface CholesterolEnrollment extends AhaEnrollmentBase {
    Careplan: 'Cholesterol';
}

export interface StrokeEnrollment extends AhaEnrollmentBase {
    Careplan: 'Stroke';
}

export interface HealthSystemEnrollment extends AhaEnrollmentBase {
    Plancode: CareplanCode;
    AssociatedHospital: string;
}

export interface AhaEnrollmentSearchFilters {
    CareplanCode?: CareplanCode;
    HealthSystem?: HealthSystem;
    IsActive?: boolean;
    StartDateFrom?: Date;
    StartDateTo?: Date;
    TenantId?: uuid;
}

export interface AhaEnrollmentSearchResults {
    Items: AhaEnrollmentBase[];
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
}
