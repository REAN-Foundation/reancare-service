export interface TestDomainModel {
    id?          : string;
    PregnancyId  : string;
    TestName     : string;
    Type         : string;
    Impression?  : string;
    Parameters?  : JSON;
    DateOfTest   : Date;
    CreatedAt?   : Date;
    UpdatedAt?   : Date;
    DeletedAt?   : Date;
}
