
export enum UserTaskCategory {
    Medication              = 'Medication',
    Appointment             = 'Appointment',
    EducationalVideo        = 'Educational-Video',
    EducationalAudio        = 'Educational-Audio',
    EducationalAnimation    = 'Educational-Animation',
    EducationalLink         = 'Educational-Link',
    EducationalInfographics = 'Educational-Infographics',
    EducationalNewsFeed     = 'Educational-NewsFeed',
    Exercise                = 'Exercise',
    Nutrition               = 'Nutrition',
    Biometrics              = 'Biometrics',
    FitnessRecord           = 'Fitness record',
    Assessment              = 'Assessment',
    StressManagement        = 'Stress management',
    Challenge               = 'Challenge',
    Goal                    = 'Goal',
    Consultation            = 'Consultation',               //Call, message or tele-visit
    PersonalReflection      = 'Personal reflection',
    Message                 = 'Message',
    Custom                  = 'Custom',
}

export const UserTaskCategoryList: UserTaskCategory [] = [
    UserTaskCategory.Medication,
    UserTaskCategory.Appointment,
    UserTaskCategory.EducationalVideo,
    UserTaskCategory.EducationalAudio,
    UserTaskCategory.EducationalAnimation,
    UserTaskCategory.EducationalLink,
    UserTaskCategory.EducationalInfographics,
    UserTaskCategory.EducationalNewsFeed,
    UserTaskCategory.Exercise,
    UserTaskCategory.Nutrition,
    UserTaskCategory.Biometrics,
    UserTaskCategory.FitnessRecord,
    UserTaskCategory.Assessment,
    UserTaskCategory.StressManagement,
    UserTaskCategory.Challenge,
    UserTaskCategory.Goal,
    UserTaskCategory.Consultation,
    UserTaskCategory.PersonalReflection,
    UserTaskCategory.Message,
    UserTaskCategory.Custom,
];

export enum UserActionType {
    Medication  = 'Medication',
    Appointment = 'Appointment',
    Careplan = "Careplan",
    Custom   = "Custom"
}

export const UserActionTypeList: UserActionType [] = [
    UserActionType.Medication,
    UserActionType.Appointment,
    UserActionType.Careplan,
];
