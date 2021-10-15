import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { DocumentDomainModel } from "../../../../../domain.types/patient/document/document.domain.model";
import { DocumentDto } from "../../../../../domain.types/patient/document/document.dto";
import { DocumentSearchFilters, DocumentSearchResults } from '../../../../../domain.types/patient/document/document.search.types';
import { SharedDocumentDetailsDomainModel } from '../../../../../domain.types/patient/document/shared.document.details.domain.model';
import { SharedDocumentDetailsDto } from '../../../../../domain.types/patient/document/shared.document.details.dto';
import { IDocumentRepo } from '../../../../repository.interfaces/patient/document.repo.interface';
import { DocumentMapper } from '../../mappers/patient/document.mapper';
import DocumentModel from '../../models/patient/document.model';
import SharedDocumentDetails from '../../models/patient/shared.document.details.model';

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
                FileName                  : documentDomainModel.FileMetaData.FileName,
                ResourceId                : documentDomainModel.FileMetaData.ResourceId,
                AuthenticatedUrl          : documentDomainModel.FileMetaData.Url,
                MimeType                  : documentDomainModel.FileMetaData.MimeType,
                SizeInKBytes              : documentDomainModel.FileMetaData.Size,
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

    sharedKeyExists = async (key: string): Promise<boolean> => {
        try {
            const result = await SharedDocumentDetails.findOne({ where: { Key: key } });
            return result !== null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    getSharedDocument = async (key: string): Promise<SharedDocumentDetailsDto> => {
        try {
            const sharedDocument = await SharedDocumentDetails.findOne({ where: { Key: key } });
            return DocumentMapper.toSharedDocumentDto(sharedDocument);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    share = async (model: SharedDocumentDetailsDomainModel): Promise<SharedDocumentDetailsDto> => {
        try {
            const entity = {
                DocumentId           : model.DocumentId,
                DocumentType         : model.DocumentType,
                PatientUserId        : model.PatientUserId,
                ResourceId           : model.ResourceId,
                OriginalLink         : model.OriginalLink,
                ShortLink            : model.ShortLink,
                Key                  : model.Key,
                SharedWithUserId     : model.SharedWithUserId,
                SharedForDurationMin : model.SharedForDurationMin,
                SharedDate           : model.SharedDate,
            };

            const document = await SharedDocumentDetails.create(entity);
            return await DocumentMapper.toSharedDocumentDto(document);
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    rename(id: string, newName: string): DocumentDto | PromiseLike<DocumentDto> {
        throw new Error('Method not implemented.');
    }

    search(filters: DocumentSearchFilters): Promise<DocumentSearchResults> {
        throw new Error('Method not implemented.');
    }

    upload(documentDomainModel: DocumentDomainModel) {
        throw new Error('Method not implemented.');
    }

}
