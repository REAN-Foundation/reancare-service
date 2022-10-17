import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { DocumentDomainModel } from "../../../../../../domain.types/users/patient/document/document.domain.model";
import { DocumentDto } from "../../../../../../domain.types/users/patient/document/document.dto";
import { DocumentSearchFilters, DocumentSearchResults } from '../../../../../../domain.types/users/patient/document/document.search.types';
import { SharedDocumentDetailsDomainModel } from '../../../../../../domain.types/users/patient/document/shared.document.details.domain.model';
import { SharedDocumentDetailsDto } from '../../../../../../domain.types/users/patient/document/shared.document.details.dto';
import { IDocumentRepo } from '../../../../../repository.interfaces/users/patient/document.repo.interface';
import { DocumentMapper } from '../../../mappers/users/patient/document.mapper';
import Document from '../../../models/users/patient/document.model';
import SharedDocumentDetails from '../../../models/users/patient/shared.document.details.model';

///////////////////////////////////////////////////////////////////////

export class DocumentRepo implements IDocumentRepo {

    upload = async (model: DocumentDomainModel): Promise<DocumentDto> => {
        try {
            const entity = {
                DisplayId                 : model.DisplayId,
                DocumentType              : model.DocumentType,
                PatientUserId             : model.PatientUserId,
                MedicalPractitionerUserId : model.MedicalPractitionerUserId,
                MedicalPractionerRole     : model.MedicalPractionerRole,
                UploadedByUserId          : model.UploadedByUserId,
                AssociatedVisitId         : model.AssociatedVisitId,
                AssociatedVisitType       : model.AssociatedVisitType,
                AssociatedOrderId         : model.AssociatedOrderId,
                AssociatedOrderType       : model.AssociatedOrderType,
                FileName                  : model.FileMetaData.OriginalName,
                ResourceId                : model.FileMetaData.ResourceId,
                AuthenticatedUrl          : model.FileMetaData.Url,
                MimeType                  : model.FileMetaData.MimeType,
                SizeInKBytes              : model.FileMetaData.Size,
                RecordDate                : model.RecordDate,
                UploadedDate              : model.UploadedDate
            };

            const document = await Document.create(entity);
            return await DocumentMapper.toDto(document);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<DocumentDto> => {
        try {
            const document = await Document.findByPk(id);
            return DocumentMapper.toDto(document);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, documentDomainModel: DocumentDomainModel):
    Promise<DocumentDto> => {
        try {
            const document = await Document.findByPk(id);

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

            return DocumentMapper.toDto(document);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await Document.destroy({ where: { id: id } });
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
    };

    getSharedDocument = async (key: string): Promise<SharedDocumentDetailsDto> => {
        try {
            const sharedDocument = await SharedDocumentDetails.findOne({ where: { Key: key } });
            return DocumentMapper.toSharedDocumentDto(sharedDocument);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

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
            return DocumentMapper.toSharedDocumentDto(document);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    rename = async (id: string, newName: string): Promise<DocumentDto> => {
        try {
            var document = await Document.findOne({ where: { id: id } });
            document.FileName = newName;
            document = await document.save();
            return DocumentMapper.toDto(document);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: DocumentSearchFilters): Promise<DocumentSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.PatientUserId != null) {
                search.where['PatientUserId'] = filters.PatientUserId;
            }
            if (filters.AssociatedOrderId != null) {
                search.where['AssociatedOrderId'] = filters.AssociatedOrderId;
            }
            if (filters.AssociatedVisitId != null) {
                search.where['AssociatedVisitId'] = filters.AssociatedVisitId;
            }
            if (filters.DocumentType != null) {
                search.where['DocumentType'] = { [Op.like]: '%' + filters.DocumentType + '%' };
            }
            if (filters.MedicalPractitionerUserId != null) {
                search.where['MedicalPractitionerUserId'] = filters.MedicalPractitionerUserId;
            }
            if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.CreatedDateTo,
                    [Op.gte] : filters.CreatedDateFrom,
                };
            }

            let orderByColum = 'UploadedDate';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await Document.findAndCountAll(search);

            const dtos: DocumentDto[] = [];
            for (const contact of foundResults.rows) {
                const dto = DocumentMapper.toDto(contact);
                dtos.push(dto);
            }

            const searchResults: DocumentSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };

            return searchResults;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
