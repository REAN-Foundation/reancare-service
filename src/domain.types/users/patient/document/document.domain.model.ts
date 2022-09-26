import { FileResourceMetadata } from "../../../general/file.resource/file.resource.types";
import { VisitType } from "../../../miscellaneous/clinical.types";
import { OrderTypes } from "../../../clinical/order/order.types";
import { Roles } from "../../../role/role.types";
import { DocumentTypes } from "./document.types";

export interface DocumentDomainModel {
    id?                       : string;
    EhrId?                    : string;
    DisplayId?                : string;
    DocumentType?             : DocumentTypes;
    PatientUserId?            : string;
    MedicalPractitionerUserId?: string;
    MedicalPractionerRole?    : Roles;
    UploadedByUserId?         : string;
    AssociatedVisitId?        : string;
    AssociatedVisitType?      : VisitType;
    AssociatedOrderId?        : string;
    AssociatedOrderType?      : OrderTypes;
    FileMetaData?             : FileResourceMetadata;
    RecordDate?               : Date;
    UploadedDate?             : Date;
}
