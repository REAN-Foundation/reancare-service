
export interface DrugDto {
    id?                  : string,
    EhrId?               : string;
    DrugName?            : string;
    GenericName?         : string;
    Ingredients?         : string;
    Strength?            : string;
    OtherCommercialNames?: string;
    Manufacturer?        : string;
    OtherInformation?    : string;
    CreatedAt?          : Date;
}
