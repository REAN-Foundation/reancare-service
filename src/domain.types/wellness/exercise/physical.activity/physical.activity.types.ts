export enum PhysicalActivityCategories {
    Aerobic           = 'Aerobic',
    Anaerobic         = 'Anaerobic',
    StrengthTraining  = 'Strength training',
    YogAsanas         = 'Yog asanas',
    AtheleticTraining = 'Atheletic training',
    Other             = 'Other',
}

export enum Intensity {
    Vigorous = 'Vigorous',
    Moderate = 'Moderate',
    Low      = 'Low',
}

export const PhysicalActivityCategoriesList: PhysicalActivityCategories [] = [
    PhysicalActivityCategories.Aerobic,
    PhysicalActivityCategories.Anaerobic,
    PhysicalActivityCategories.StrengthTraining,
    PhysicalActivityCategories.YogAsanas,
    PhysicalActivityCategories.AtheleticTraining,
    PhysicalActivityCategories.Other,
];

export const IntensityList: Intensity [] = [
    Intensity.Vigorous,
    Intensity.Moderate,
    Intensity.Low,
];
