export enum ClinicalValidationStatus {
    Preliminary = 'Preliminary',
    Confirmed   = 'Confirmed',
    Amended     = 'Amended',
    Negated     = 'Negated',
    Probable    = 'Probable',
    Unknown     = 'Unknown'
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
    Normal                = 'Normal',
    Abnormal              = 'Abnormal',
    CriticallyAbnormal    = 'Critically abnormal',
    Negative              = 'Negative',
    Positive              = 'Positive',
    CriticallyLow         = 'Critically low',
    Low                   = 'Low',
    High                  = 'High',
    CriticallyHigh        = 'Critically high',
    VerySusceptible       = 'Very susceptible',
    Susceptible           = 'Susceptible',
    Intermediate          = 'Intermediate',
    Resistant             = 'Resistant',
    SignificantChangeDown = 'Significant change down',
    SignificantChangeUp   = 'Significant change up',
    OffScaleLow           = 'Off scale low',
    OffScaleHigh          = 'Off scale high'
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

//Visit/Encounter types
export enum VisitType {
    DoctorVisit = 'Doctor visit',
    LabVisit    = 'Lab visit',
    TeleVisit   = 'Tele visit',
    Unknown     = 'Unknown'
}

export const VisitTypeList: VisitType[] = [
    VisitType.DoctorVisit,
    VisitType.LabVisit,
    VisitType.TeleVisit,
    VisitType.Unknown
];

export enum DonorType {
    OneTime     = 'One time',
    BloodBridge = 'Blood bridge'
}

export const DonorTypeList: DonorType[] = [
    DonorType.OneTime,
    DonorType.BloodBridge
];

export enum BridgeStatus {
    Active        = 'Active',
    Inactive      = 'Inactive',
    NotResponding = 'Not Responding'
}

export const BridgeStatusList: BridgeStatus[] = [
    BridgeStatus.Active,
    BridgeStatus.Inactive,
    BridgeStatus.NotResponding
];

export enum DonorAcceptance {
    Send     = 'Send',
    NotSend  = 'NotSend',
    Accepted = 'Accepted'
}

export const DonorAcceptanceList: DonorAcceptance[] = [
    DonorAcceptance.Send,
    DonorAcceptance.NotSend,
    DonorAcceptance.Accepted
];
