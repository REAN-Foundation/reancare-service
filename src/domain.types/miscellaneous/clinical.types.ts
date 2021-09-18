export enum ClinicalValidationStatus {
    Preliminary = 'Preliminary',
    Confirmed = 'Confirmed',
    Amended = 'Amended',
    Negated = 'Negated',
    Probable = 'Probable',
    Unknown = 'Unknown'
}

export const ClinicalValidationStatusList: ClinicalValidationStatus[] = [
    ClinicalValidationStatus.Preliminary,
    ClinicalValidationStatus.Confirmed,
    ClinicalValidationStatus.Amended,
    ClinicalValidationStatus.Negated,
    ClinicalValidationStatus.Probable,
    ClinicalValidationStatus.Unknown
];

export enum ClinicalInterpretation {
    Normal = 'Normal',
    Abnormal = 'Abnormal',
    CriticallyAbnormal = 'Critically abnormal',
    Negative = 'Negative',
    Positive = 'Positive',
    CriticallyLow = 'Critically low',
    Low = 'Low',
    High = 'High',
    CriticallyHigh = 'Critically high',
    VerySusceptible = 'Very susceptible',
    Susceptible = 'Susceptible',
    Intermediate = 'Intermediate',
    Resistant = 'Resistant',
    SignificantChangeDown = 'Significant change down',
    SignificantChangeUp = 'Significant change up',
    OffScaleLow = 'Off scale low',
    OffScaleHigh = 'Off scale high'
}

export const ClinicalInterpretationList: ClinicalInterpretation[] = [
    ClinicalInterpretation.Normal,
    ClinicalInterpretation.Abnormal,
    ClinicalInterpretation.CriticallyAbnormal,
    ClinicalInterpretation.Negative,
    ClinicalInterpretation.Positive,
    ClinicalInterpretation.CriticallyLow,
    ClinicalInterpretation.Low,
    ClinicalInterpretation.High,
    ClinicalInterpretation.CriticallyHigh,
    ClinicalInterpretation.VerySusceptible,
    ClinicalInterpretation.Susceptible,
    ClinicalInterpretation.Intermediate,
    ClinicalInterpretation.Resistant,
    ClinicalInterpretation.SignificantChangeDown,
    ClinicalInterpretation.SignificantChangeUp,
    ClinicalInterpretation.OffScaleLow,
    ClinicalInterpretation.OffScaleHigh,
];
