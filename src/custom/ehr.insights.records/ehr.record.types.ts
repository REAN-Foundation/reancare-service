export enum EHRRecordTypes {
    Birthdate                     = 'Birthdate',
    Gender                        = 'Gender',
    Race                          = 'Race',
    Ethnicity                     = 'Ethnicity',
    Diabetic                      = 'Diabetic',
    Smoker                        = 'Smoker',
    BloodGroup                    = 'BloodGroup',
    HealthSystem                  = 'Health-System',
    BodyHeight                    = 'Body-Height',
    BodyWeight                    = 'Body-Weight',
    BodyTemperature               = 'Body-Temperature',
    BloodPressure_Systolic        = 'Blood-Pressure-Systolic',
    BloodPressure_Distolic        = 'Blood-Pressure-Distolic',
    BloodGlucose                  = 'Blood-Glucose',
    Cholesterol_Total             = 'Cholesterol-Total',
    Cholesterol_HDL               = 'Cholesterol-HDL',
    Cholesterol_LDL               = 'Cholesterol-LDL',
    Cholesterol_TriglycerideLevel = 'Cholesterol-Triglyceride-Level',
    Cholesterol_Ratio             = 'Cholesterol-Ratio',
    Cholesterol_A1CLevel          = 'Cholesterol-A1C-Level',
    BloodOxygenSaturation         = 'Blood-Oxygen-Saturation',
    Symptom                       = 'Symptom',
    Medication                    = 'Medication',
    Feeling                       = 'Feeling',
    Mood                          = 'Mood',
    EnergyLevel                   = 'Energy-Level',
    LabRecord                     = 'Lab-Record',
    Other                         = 'Other'
}

export enum DataTypes {
    Integer = 'Integer',
    Boolean = 'Boolean',
    Float   = 'Float',
    String  = 'String'
}
