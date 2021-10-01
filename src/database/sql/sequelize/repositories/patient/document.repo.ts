import { IDocumentRepo } from '../../../../repository.interfaces/patient/document.repo.interface';
import DocumentModel  from '../../models/patient/document.model';
import { DocumentMapper } from '../../mappers/patient/document.mapper';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { DocumentDomainModel } from "../../../../../domain.types/patient/document/document.domain.model";
import { DocumentDto } from "../../../../../domain.types/patient/document/document.dto";

///////////////////////////////////////////////////////////////////////

export class DocumentRepo implements IDocumentRepo {

    create = async (documentDomainModel: DocumentDomainModel):
    Promise<DocumentDto> => {
        try {
            const entity = {
                DocumentType              : documentDomainModel.DocumentType,
                PatientUserId             : documentDomainModel.PatientUserId,
                MedicalPractitionerUserId : documentDomainModel.MedicalPractitionerUserId,
                MedicalPractionerRole     : documentDomainModel.MedicalPractionerRole,
                UploadedByUserId          : documentDomainModel.UploadedByUserId,
                AssociatedVisitId         : documentDomainModel.AssociatedVisitId,
                AssociatedVisitType       : documentDomainModel.AssociatedVisitType,
                AssociatedOrderId         : documentDomainModel.AssociatedOrderId,
                AssociatedOrderType       : documentDomainModel.AssociatedOrderType,
                FileName                  : documentDomainModel.FileName,
                ResourceId                : documentDomainModel.ResourceId,
                AuthenticatedUrl          : documentDomainModel.AuthenticatedUrl,
                MimeType                  : documentDomainModel.MimeType,
                SizeInKBytes              : documentDomainModel.SizeInKBytes,
                RecordDate                : documentDomainModel.RecordDate,
                UploadedDate              : documentDomainModel.UploadedDate
            };

            const document = await DocumentModel.create(entity);
            const dto = await DocumentMapper.toDto(document);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<DocumentDto> => {
        try {
            const document = await DocumentModel.findByPk(id);
            const dto = await DocumentMapper.toDto(document);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, documentDomainModel: DocumentDomainModel):
    Promise<DocumentDto> => {
        try {
            const document = await DocumentModel.findByPk(id);

            if (documentDomainModel.DocumentType != null) {
                document.DocumentType = documentDomainModel.DocumentType;
            }
            if (documentDomainModel.PatientUserId != null) {
                document.PatientUserId = documentDomainModel.PatientUserId;
            }
            if (documentDomainModel.MedicalPractitionerUserId != null) {
                document.MedicalPractitionerUserId = documentDomainModel.MedicalPractitionerUserId;
            }
            if (documentDomainModel.MedicalPractionerRole != null) {
                document.MedicalPractionerRole = documentDomainModel.MedicalPractionerRole;
            }
            if (documentDomainModel.UploadedByUserId != null) {
                document.UploadedByUserId = documentDomainModel.UploadedByUserId;
            }
            if (documentDomainModel.AssociatedVisitId != null) {
                document.AssociatedVisitId = documentDomainModel.AssociatedVisitId;
            }
            if (documentDomainModel.AssociatedVisitType != null) {
                document.AssociatedVisitType = documentDomainModel.AssociatedVisitType;
            }
            if (documentDomainModel.AssociatedOrderId != null) {
                document.AssociatedOrderId = documentDomainModel.AssociatedOrderId;
            }
            if (documentDomainModel.AssociatedOrderType != null) {
                document.AssociatedOrderType = documentDomainModel.AssociatedOrderType;
            }
            if (documentDomainModel.FileName != null) {
                document.FileName = documentDomainModel.FileName;
            }
            if (documentDomainModel.ResourceId != null) {
                document.ResourceId = documentDomainModel.ResourceId;
            }
            if (documentDomainModel.AuthenticatedUrl != null) {
                document.AuthenticatedUrl = documentDomainModel.AuthenticatedUrl;
            }
            if (documentDomainModel.MimeType != null) {
                document.MimeType = documentDomainModel.MimeType;
            }
            if (documentDomainModel.SizeInKBytes != null) {
                document.SizeInKBytes = documentDomainModel.SizeInKBytes;
            }
            if (documentDomainModel.RecordDate != null) {
                document.RecordDate = documentDomainModel.RecordDate;
            }
            if (documentDomainModel.UploadedDate != null) {
                document.UploadedDate = documentDomainModel.UploadedDate;
            }
    
            await document.save();

            const dto = await DocumentMapper.toDto(document);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await DocumentModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
