export enum AllergenCategories {
    Animals = 'Pets/Insects/Animals',
    Chemicals = 'Drug/Chemicals',
    Environmental = "Environmental",
    Food = 'Food',
    Plant = 'Plant',
    Pollen = "Pollen",
    Miscellaneous = 'Miscellaneous',
    MiscellaneousContraindication = 'Miscellaneous Contraindication',
    Unknown = 'Unknown'
}

//Allergy related types
export type AllergenExposureRoutes = 'Airway'| 'Injection' | 'Food' | 'Contact' | null;
