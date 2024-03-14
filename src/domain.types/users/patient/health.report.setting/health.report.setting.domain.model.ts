export interface HealthReportSettingDomainModel {
    id?: string;
    PatientUserId?: string;
    Preference?: Settings;
}

export interface Settings {
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
