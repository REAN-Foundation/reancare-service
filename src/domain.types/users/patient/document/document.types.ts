
export enum DocumentTypes {
    LabReport = 'Lab report',
    ImagingStudy = 'Imaging study',
    DrugPrescription = 'Drug prescription',
    DiagnosticPrescription = 'Diagnostic prescription',
    DoctorNotes = 'Doctor notes',
    DischargeSummary = 'Discharge summary',
    OpdPaper = 'OPD paper',
    Assessment = 'Assessment',
    Statistics = 'Statistics',
    Unknown = 'Unknown'
}

export const DocumentTypesList: DocumentTypes [] = [
    DocumentTypes.LabReport,
    DocumentTypes.ImagingStudy,
    DocumentTypes.DrugPrescription,
    DocumentTypes.DiagnosticPrescription,
    DocumentTypes.DoctorNotes,
    DocumentTypes.DischargeSummary,
    DocumentTypes.OpdPaper,
    DocumentTypes.Assessment,
    DocumentTypes.Statistics,
    DocumentTypes.Unknown,
];
