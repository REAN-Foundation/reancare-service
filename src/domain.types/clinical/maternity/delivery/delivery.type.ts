export enum DeliveryOutcome {
    Aborted      = 'Aborted',
    Miscarriage  = 'Miscarriage',
    LiveBirth    = 'Live Birth',
    FetalDemise  = 'Fetal Demise',
}

export const DeliveryOutcomeList = [
    DeliveryOutcome.Aborted,
    DeliveryOutcome.Miscarriage,
    DeliveryOutcome.LiveBirth,
    DeliveryOutcome.FetalDemise,
];


export enum DeliveryMode {
    Normal   = 'Normal',
    LSCS     = 'LSCS',               // Lower Segment Caesarean Section
    VBAC     = 'VBAC',              // Vaginal Birth After Cesarean 
    Assisted = 'Assisted',         // For forceps or vaccum deliveries 
}

export const DeliveryModeList = [
    DeliveryMode.Normal,
    DeliveryMode.LSCS,
    DeliveryMode.VBAC,
    DeliveryMode.Assisted,
];
