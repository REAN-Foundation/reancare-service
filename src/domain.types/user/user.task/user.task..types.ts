
export enum UserTaskCategory {
    Medication         = 'Medication',
    Appointment        = 'Appointment',
    Educational        = 'Educational',
    Exercise           = 'Exercise',
    Nutrition          = 'Nutrition',
    Biometrics         = 'Biometrics',
    FitnessRecord      = 'Fitness record',
    ClinicalAssessment = 'Clinical assessment',
    StressManagement   = 'Stress management',
    Challenge          = 'Challenge',
    Goal               = 'Goal',
    Consultation       = 'Consultation',          //Call, message or tele-visit
    PersonalReflection = 'Personal reflection',
    Custom             = 'Custom',
}

export const UserTaskCategoryList: UserTaskCategory [] = [
    UserTaskCategory.Medication,
    UserTaskCategory.Appointment,
    UserTaskCategory.Educational,
    UserTaskCategory.Exercise,
    UserTaskCategory.Nutrition,
    UserTaskCategory.Biometrics,
    UserTaskCategory.FitnessRecord,
    UserTaskCategory.ClinicalAssessment,
    UserTaskCategory.StressManagement,
    UserTaskCategory.Challenge,
    UserTaskCategory.Goal,
    UserTaskCategory.Consultation,
    UserTaskCategory.PersonalReflection,
    UserTaskCategory.Custom,
];

export enum UserActionType {
    Medication  = 'Medication',
    Appointment = 'Appointment',
    Careplan = "Careplan"
}

export const UserActionTypeList: UserActionType [] = [
    UserActionType.Medication,
    UserActionType.Appointment,
    UserActionType.Careplan,
];
