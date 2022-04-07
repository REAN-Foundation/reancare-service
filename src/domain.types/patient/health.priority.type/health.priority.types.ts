
export enum HealthPriorityType {
    PhysicalActivity = 'Physical Activity',
    Nutrition        = 'Nutrition',
    Weight           = 'Weight',
    Tobacco          = 'Tobacco',
    BloodPressure    = 'Blood Pressure',
    Cholesterol      = 'Cholesterol',
    Glucose          = 'Glucose',
    Medications      = 'Medications',
    MentalHealth     = 'Mental Health',
    LifesSimple7     = 'Lifes Simple 7',
    ChildhoodObesity = 'Childhood Obesity',
    Professional     = 'Professional',
    Custom           = 'Custom',
}

export const HealthPriorityTypeList: HealthPriorityType [] = [
    HealthPriorityType.PhysicalActivity,
    HealthPriorityType.Nutrition,
    HealthPriorityType.Weight,
    HealthPriorityType.Tobacco,
    HealthPriorityType.BloodPressure,
    HealthPriorityType.Cholesterol,
    HealthPriorityType.Glucose,
    HealthPriorityType.Medications,
    HealthPriorityType.MentalHealth,
    HealthPriorityType.LifesSimple7,
    HealthPriorityType.ChildhoodObesity,
    HealthPriorityType.Professional,
    HealthPriorityType.Custom,
];
