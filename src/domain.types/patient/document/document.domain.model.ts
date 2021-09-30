import { Roles } from "../../role/role.types";
import { VisitTypes } from "../../miscellaneous/system.types";
import { OrderTypes } from "../../clinical/order/order.types";
import { DocumentTypes } from "./document.types";

export interface DocumentDomainModel {
    id?: string;
    EhrId?: string;
    DocumentType?: DocumentTypes;
    PatientUserId?: string;
    MedicalPractitionerUserId?: string;
    MedicalPractionerRole?: Roles;
    UploadedByUserId?: string;
    AssociatedVisitId?: string;
    AssociatedVisitType?: VisitTypes;
    AssociatedOrderId?: string;
    AssociatedOrderType?: OrderTypes;
    FileName?: string;
    ResourceId?: string;
    AuthenticatedUrl?: string;
    MimeType?: string;
    SizeInKBytes?: number;
    RecordDate?: Date;
    UploadedDate?: Date;
}
