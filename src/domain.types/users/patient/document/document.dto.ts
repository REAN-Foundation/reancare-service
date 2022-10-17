import { VisitType } from "../../../miscellaneous/clinical.types";
import { OrderTypes } from "../../../clinical/order/order.types";
import { DocumentTypes } from "./document.types";

export interface DocumentDto {
    id                        : string;
    EhrId?                    : string;
    DisplayId                 : string;
    DocumentType?             : DocumentTypes;
    PatientUserId?            : string;
    MedicalPractitionerUserId?: string;
    MedicalPractionerRole?    : string;
    UploadedByUserId?         : string;
    AssociatedVisitId?        : string;
    AssociatedVisitType?      : VisitType;
    AssociatedOrderId?        : string;
    AssociatedOrderType?      : OrderTypes;
    FileName?                 : string;
    ResourceId                : string;
    AuthenticatedUrl?         : string;
    MimeType?                 : string;
    SizeInKBytes?             : number;
    RecordDate?               : Date;
    UploadedDate?             : Date;
}
