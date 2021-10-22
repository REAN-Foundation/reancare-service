export enum OrderTypes {
    DrugOrder                   = 'Drug order',
    DiagnosticPathologyLabOrder = 'Diagnostic pathology lab order',
    DiagnosticImagingStudyOrder = 'Diagnostic imaging study order',
    MiscellaneousOrder          = 'Miscellaneous order',
    Unknown                     = 'Unknown'
}

export enum OrderStates {
    Initiated   = 'Initiated',
    Confirmed   = 'Confirmed',
    InProgress  = 'In-progress',
    RaisedQuery = 'Raised query',
    Cancelled   = 'Cancelled',
    Completed   = 'Completed',
    Unknown     = 'Unknown'
}
