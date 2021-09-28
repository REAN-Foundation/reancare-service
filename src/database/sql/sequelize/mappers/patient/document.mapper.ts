import DocumentModel from '../../models/patient/document.model';
import { DocumentDto } from '../../../../../domain.types/patient/document/document.dto';
import { DocumentTypes } from '../../../../../domain.types/patient/document/document.types';
import { Roles } from '../../../../../domain.types/role/role.types';
import { VisitTypes } from '../../../../../domain.types/miscellaneous/system.types';
import { OrderTypes } from '../../../../../domain.types/order/order.types';

///////////////////////////////////////////////////////////////////////////////////

export class DocumentMapper {

    static toDto = (
        document: DocumentModel): DocumentDto => {
        if (document == null) {
            return null;
        }
        const dto: DocumentDto = {
            id                        : document.id,
            EhrId                     : document.EhrId,
            DocumentType              : DocumentTypes[document.DocumentType],
            PatientUserId             : document.PatientUserId,
            MedicalPractitionerUserId : document.MedicalPractitionerUserId,
            MedicalPractionerRole     : Roles[document.MedicalPractionerRole],
            UploadedByUserId          : document.UploadedByUserId,
            AssociatedVisitId         : document.AssociatedVisitId,
            AssociatedVisitType       : VisitTypes[document.AssociatedVisitType],
            AssociatedOrderId         : document.AssociatedOrderId,
            AssociatedOrderType       : OrderTypes[document.AssociatedOrderType],
            FileName                  : document.FileName,
            ResourceId                : document.ResourceId,
            AuthenticatedUrl          : document.AuthenticatedUrl,
            MimeType                  : document.MimeType,
            SizeInKBytes              : document.SizeInKBytes,
            RecordDate                : document.RecordDate,
            UploadedDate              : document.UploadedDate,
        };
        return dto;
    }

}
