export interface HealthReportSettingsDomainModel {
    id?: string;
    PatientUserId?: string;
    Preference?: Settings;
}

export interface Settings {
    ReportFrequency?: ReportFrequency;
    HealthJourney: boolean;
    MedicationAdherence: boolean;
    BodyWeight: boolean;
    BloodGlucose: boolean;
    BloodPressure: boolean;
    SleepHistory: boolean;
    LabValues: boolean;
    ExerciseAndPhysicalActivity:boolean;
    FoodAndNutrition: boolean;
    DailyTaskStatus: boolean;
    MoodAndSymptoms: boolean;
}

export enum ReportFrequency {
    WEEK = "WEEK",
    MONTH = "MONTH",
    SIXMONTH = "SIXMONTH",
    YEAR = "YEAR",
}

