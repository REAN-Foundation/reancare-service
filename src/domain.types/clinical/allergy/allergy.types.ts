export enum AllergenCategories {
    Animals              = 'Pets/Insects/Animals',
    Chemicals            = 'Drug/Chemicals',
    Environmental        = "Environmental",
    Food                 = 'Food',
    Plant                = 'Plant',
    Pollen               = "Pollen",
    Miscellaneous        = 'Miscellaneous',
    MiscContraindication = 'Miscellaneous Contraindication',
    Unknown              = 'Unknown'
}

export const AllergenCategoriesList: AllergenCategories[] = [
    AllergenCategories.Animals,
    AllergenCategories.Chemicals,
    AllergenCategories.Environmental,
    AllergenCategories.Food,
    AllergenCategories.Plant,
    AllergenCategories.Pollen,
    AllergenCategories.Miscellaneous,
    AllergenCategories.MiscContraindication,
    AllergenCategories.Unknown
];

export enum AllergenExposureRoutes {
    Airway    = 'Airway',
    Injection = 'Injection',
    Food      = "Food",
    Contact   = 'Contact',
    Unknown   = 'Unknown'
}

export const AllergenExposureRoutesList: AllergenExposureRoutes[] = [
    AllergenExposureRoutes.Airway,
    AllergenExposureRoutes.Injection,
    AllergenExposureRoutes.Food,
    AllergenExposureRoutes.Contact,
    AllergenExposureRoutes.Unknown,
];
