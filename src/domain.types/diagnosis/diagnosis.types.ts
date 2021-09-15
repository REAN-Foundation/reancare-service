export enum ValidationStatus {
    Preliminary = 'Preliminary',
    Confirmed = 'Confirmed',
    Amended = 'Amended',
    Negated = 'Negated',
    Probable = 'Probable',
    Unknown = 'Unknown'
}

export const ValidationStatusList: ValidationStatus[] = [
    ValidationStatus.Preliminary,
    ValidationStatus.Confirmed,
    ValidationStatus.Amended,
    ValidationStatus.Negated,
    ValidationStatus.Probable,
    ValidationStatus.Unknown
];

export enum DiagnosisInterpretation {
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

export const DiagnosisInterpretationList: DiagnosisInterpretation[] = [
    DiagnosisInterpretation.Normal,
    DiagnosisInterpretation.Abnormal,
    DiagnosisInterpretation.CriticallyAbnormal,
    DiagnosisInterpretation.Negative,
    DiagnosisInterpretation.Positive,
    DiagnosisInterpretation.CriticallyLow,
    DiagnosisInterpretation.Low,
    DiagnosisInterpretation.High,
    DiagnosisInterpretation.CriticallyHigh,
    DiagnosisInterpretation.VerySusceptible,
    DiagnosisInterpretation.Susceptible,
    DiagnosisInterpretation.Intermediate,
    DiagnosisInterpretation.Resistant,
    DiagnosisInterpretation.SignificantChangeDown,
    DiagnosisInterpretation.SignificantChangeUp,
    DiagnosisInterpretation.OffScaleLow,
    DiagnosisInterpretation.OffScaleHigh,
];
