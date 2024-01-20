export enum CareplanCode {
    Cholesterol = 'Cholesterol',
    Stroke = 'Stroke',
    CholesterolMini = 'CholesterolMini',
    HeartFailure = 'HeartFailure'
}

export enum AppName {
   HS = 'Heart &amp; Stroke Helper™',
   HF = 'HF Helper'
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
