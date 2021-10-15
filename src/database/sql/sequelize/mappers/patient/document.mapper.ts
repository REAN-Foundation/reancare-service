import { OrderTypes } from '../../../../../domain.types/clinical/order/order.types';
import { VisitType } from '../../../../../domain.types/miscellaneous/clinical.types';
import { DocumentDto } from '../../../../../domain.types/patient/document/document.dto';
import { DocumentTypes } from '../../../../../domain.types/patient/document/document.types';
import { Roles } from '../../../../../domain.types/role/role.types';
import DocumentModel from '../../models/patient/document.model';
import sharedDocumentDetailsModel from '../../models/patient/shared.document.details.model';

///////////////////////////////////////////////////////////////////////////////////

export class DocumentMapper {
    static toSharedDocumentDto(sharedDocument: sharedDocumentDetailsModel): Promise<import("../../../../../domain.types/patient/document/shared.document.details.dto").SharedDocumentDetailsDto> {
        throw new Error('Method not implemented.');
    }

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

}
