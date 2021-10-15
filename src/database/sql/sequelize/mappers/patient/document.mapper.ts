import { OrderTypes } from '../../../../../domain.types/clinical/order/order.types';
import { VisitType } from '../../../../../domain.types/miscellaneous/clinical.types';
import { DocumentDto } from '../../../../../domain.types/patient/document/document.dto';
import { DocumentTypes } from '../../../../../domain.types/patient/document/document.types';
import { SharedDocumentDetailsDto } from '../../../../../domain.types/patient/document/shared.document.details.dto';
import { Roles } from '../../../../../domain.types/role/role.types';
import DocumentModel from '../../models/patient/document.model';
import SharedDocumentDetails from '../../models/patient/shared.document.details.model';

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
            AssociatedVisitType       : VisitType[document.AssociatedVisitType],
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

    static toSharedDocumentDto = (sharedDocument: SharedDocumentDetails): SharedDocumentDetailsDto => {

        if (sharedDocument == null) {
            return null;
        }

        const dto: SharedDocumentDetailsDto = {
            id                   : sharedDocument.id,
            DocumentId           : sharedDocument.DocumentId,
            PatientUserId        : sharedDocument.PatientUserId,
            ResourceId           : sharedDocument.ResourceId,
            OriginalLink         : sharedDocument.OriginalLink,
            ShortLink            : sharedDocument.ShortLink,
            Key                  : sharedDocument.Key,
            SharedWithUserId     : sharedDocument.SharedWithUserId,
            SharedForDurationMin : sharedDocument.SharedForDurationMin,
            SharedDate           : sharedDocument.SharedDate,
        };

        return dto;
    }

}
