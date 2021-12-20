export interface CareplanArtifactDomainModel {
    id?         : string;
    UserId      : string;
    EnrollmentId: number;
    FromDate    : Date;
    ToDate      : Date;
    Status      : string;
    PageNumber  : number;
    PageOffset  : number;
    PageSize    : string;
    PageOrder   : string;
}
