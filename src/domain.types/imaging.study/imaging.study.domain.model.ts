//#region Domain models

export interface ImagingStudyDomainModel {
    id?                          : string;
    PatientUserId?               : string;
    EhrId?                       : string;
    LabVisitId?                  : string;
    LabVisitEhrId?               : string;
    PrescribedById?              : string;
    PrescribedByEhrId?           : string;
    Name?                        : string;
    Type?                        : string;
    BodySite?                    : string;
    DicomResourceEhrId?          : string;
    SeriesCount?                 : number;
    InstanceCount?               : number;
    StudyDate?                   : Date;
    PerformedById?               : string;
    PerformedByEhrId?            : string;
    PerformedAtLocationEhrId?    : string;
    PerformedAtOrganizationId?   : string;
    PerformedAtOrganizationEhrId?: string;
    Findings?                    : string;
    }

//#endregion
