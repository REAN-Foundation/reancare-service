
export enum LabRecordType {
    TotalCholesterol  = 'Total Cholesterol',
    HDL               = 'HDL',
    LDL               = 'LDL',
    TriglycerideLevel = 'Triglyceride Level',
    CholesterolRatio  = 'Cholesterol Ratio',
    A1CLevel          = 'A1C Level',
    Lipoprotein       = 'Lipoprotein',

}

export const LabRecordTypes = Object.keys(LabRecordType);

export const LabRecordTypeList: LabRecordType [] = [
    LabRecordType.TotalCholesterol,
    LabRecordType.HDL,
    LabRecordType.LDL,
    LabRecordType.TriglycerideLevel,
    LabRecordType.CholesterolRatio,
    LabRecordType.A1CLevel,
    LabRecordType.Lipoprotein,
];
