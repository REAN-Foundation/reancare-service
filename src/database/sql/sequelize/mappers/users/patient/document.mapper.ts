import { OrderTypes } from '../../../../../../domain.types/clinical/order/order.types';
import { VisitType } from '../../../../../../domain.types/miscellaneous/clinical.types';
import { DocumentDto } from '../../../../../../domain.types/users/patient/document/document.dto';
import { DocumentTypes } from '../../../../../../domain.types/users/patient/document/document.types';
import { SharedDocumentDetailsDto } from '../../../../../../domain.types/users/patient/document/shared.document.details.dto';
import DocumentModel from '../../../models/users/patient/document.model';
import SharedDocumentDetails from '../../../models/users/patient/shared.document.details.model';

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
            DisplayId                 : document.DisplayId,
            DocumentType              : document.DocumentType as DocumentTypes,
            PatientUserId             : document.PatientUserId,
            MedicalPractitionerUserId : document.MedicalPractitionerUserId,
            MedicalPractionerRole     : document.MedicalPractionerRole,
            UploadedByUserId          : document.UploadedByUserId,
            AssociatedVisitId         : document.AssociatedVisitId,
            AssociatedVisitType       : document.AssociatedVisitType as VisitType,
            AssociatedOrderId         : document.AssociatedOrderId,
            AssociatedOrderType       : document.AssociatedOrderType as OrderTypes,
            FileName                  : document.FileName,
            ResourceId                : document.ResourceId,
            AuthenticatedUrl          : document.AuthenticatedUrl,
            MimeType                  : document.MimeType,
            SizeInKBytes              : document.SizeInKBytes,
            RecordDate                : document.RecordDate,
            UploadedDate              : document.UploadedDate,
        };
        return dto;
    };

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
    };

}
