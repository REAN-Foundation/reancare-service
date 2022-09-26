import express from 'express';
import fs from 'fs';
import * as genpass from 'generate-password';
import path from 'path';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { Helper } from '../../../../common/helper';
import { ResponseHandler } from '../../../../common/response.handler';
import { TimeHelper } from '../../../../common/time.helper';
import { ConfigurationManager } from '../../../../config/configuration.manager';
import { FileResourceUploadDomainModel } from '../../../../domain.types/general/file.resource/file.resource.domain.model';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { DocumentDto } from '../../../../domain.types/users/patient/document/document.dto';
import { DocumentSearchFilters } from '../../../../domain.types/users/patient/document/document.search.types';
import { DocumentTypesList } from '../../../../domain.types/users/patient/document/document.types';
import { SharedDocumentDetailsDomainModel } from '../../../../domain.types/users/patient/document/shared.document.details.domain.model';
import { SharedDocumentDetailsDto } from '../../../../domain.types/users/patient/document/shared.document.details.dto';
import { FileResourceService } from '../../../../services/general/file.resource.service';
import { DocumentService } from '../../../../services/users/patient/document.service';
import { Loader } from '../../../../startup/loader';
import { DocumentValidator } from './document.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class DocumentController {

    //#region member variables and constructors

    _service: DocumentService = null;

    _fileResourceService: FileResourceService = null;

    _authorizer: Authorizer = null;

    _validator: DocumentValidator = new DocumentValidator();

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(DocumentService);
        this._fileResourceService = Loader.container.resolve(FileResourceService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    getTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.GetTypes';
            ResponseHandler.success(request, response, 'Document retrieved successfully!', 200, {
                PatientDocumentTypes : DocumentTypesList,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    upload = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.Upload';
            await this._authorizer.authorize(request, response);

            const documentDomainModel = await this._validator.upload(request);

            var fileResourceDomainModel : FileResourceUploadDomainModel = {
                FileMetadata           : documentDomainModel.FileMetaData,
                IsMultiResolutionImage : false,
                IsPublicResource       : false,
                OwnerUserId            : documentDomainModel.PatientUserId,
                UploadedByUserId       : documentDomainModel.UploadedByUserId
            };
            var fileResourceDto = await this._fileResourceService.upload(fileResourceDomainModel);
            documentDomainModel.FileMetaData = fileResourceDto.DefaultVersion;

            const document = await this._service.upload(documentDomainModel);
            if (document == null) {
                throw new ApiError(400, 'Cannot upload document!');
            }
            ResponseHandler.success(request, response, 'Document uploaded successfully!', 201, {
                PatientDocument : document,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.GetById';

            await this._authorizer.authorize(request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');
            const Document = await this._service.getById(id);
            if (Document == null) {
                throw new ApiError(404, ' Document not found.');
            }

            ResponseHandler.success(request, response, 'Document retrieved successfully!', 200, {
                PatientDocument : Document,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await this._validator.update(request);
            const id: string = await this._validator.getParamUuid(request, 'id');

            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Document not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update document!');
            }

            ResponseHandler.success(request, response, 'Document updated successfully!', 200, {
                PatientDocument : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.Search';

            await this._authorizer.authorize(request, response);

            var filters: DocumentSearchFilters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} patient document records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { PatientDocuments: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    rename = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.Rename';

            await this._authorizer.authorize(request, response);

            const newName = await this._validator.rename(request);
            const id: string = await this._validator.getParamUuid(request, 'id');

            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Document not found.');
            }

            const prevFilenameExtension = Helper.getFileExtension(existingRecord.FileName).toLowerCase();
            const newFilenameExtension = Helper.getFileExtension(newName).toLowerCase();
            if (prevFilenameExtension !== newFilenameExtension) {
                throw new ApiError(409, 'New file name extension does not match with the existing file name extension.');
            }

            const renamed = await this._fileResourceService.rename(existingRecord.ResourceId, newName);
            if (!renamed) {
                throw new ApiError(400, 'Unable to rename document!');
            }
            const updated: DocumentDto = await this._service.rename(id, newName);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update document!');
            }

            ResponseHandler.success(request, response, 'Document renamed successfully!', 200, {
                PatientDocument : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    download = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.Download';

            await this._authorizer.authorize(request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Document not found.');
            }

            const localDestination = await this._fileResourceService.downloadById(existingRecord.ResourceId);
            if (localDestination == null) {
                throw new ApiError(404, 'File resource not found.');
            }

            var filename = path.basename(localDestination);
            response.setHeader('Content-disposition', 'attachment; filename=' + filename);
            var filestream = fs.createReadStream(localDestination);
            filestream.pipe(response);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    share = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.Share';

            await this._authorizer.authorize(request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');
            var durationMinutes = await this._validator.getQueryInt(request, 'durationMinutes');
            if (durationMinutes === null) {
                durationMinutes = 15;
            }
            const sharedWithUserId = await this._validator.getQueryUuid(request, 'sharedWithUserId');

            const document = await this._service.getById(id);
            if (document == null) {
                throw new ApiError(404, 'Document not found.');
            }

            var originalLink = await this._fileResourceService.getShareableLink(
                document.ResourceId, durationMinutes);

            var { scrambled, link } = await this.generateShortLink();

            var sharingDomainModel: SharedDocumentDetailsDomainModel = {
                DocumentId           : document.id,
                ResourceId           : document.ResourceId,
                PatientUserId        : document.PatientUserId,
                DocumentType         : document.DocumentType,
                OriginalLink         : originalLink,
                Key                  : scrambled,
                ShortLink            : link,
                SharedForDurationMin : durationMinutes,
                SharedWithUserId     : sharedWithUserId ?? null,
                SharedDate           : new Date(),
            };

            await this._service.share(sharingDomainModel);

            ResponseHandler.success(request, response, 'Document shareable link retrieved successfully!', 200, {
                PatientDocumentLink : link,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.Delete';

            await this._authorizer.authorize(request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Document not found.');
            }

            var resourceDeleted = await this._fileResourceService.delete(
                existingRecord.ResourceId);
            if (!resourceDeleted) {
                throw new ApiError(400, 'File resource cannot be deleted.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Document cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Document deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getSharedDocument = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.GetSharedDocument';

            const key: string = await this._validator.getParamStr(request, 'key');

            var document: SharedDocumentDetailsDto = await this._service.getSharedDocument(key);
            if (document === null) {
                throw new ApiError(404, 'The document cannot be found.');
            }

            const now = new Date();
            const sharedAt = document.SharedDate;
            const duration = document.SharedForDurationMin;
            const validTill = TimeHelper.addDuration(sharedAt, duration, DurationType.Minute);
            const linkExpired = TimeHelper.isAfter(now, validTill);
            if (linkExpired) {
                throw new ApiError(400, 'Document link has expired.');
            }

            response.status(301).redirect(document.OriginalLink);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    generateShortLink = async () => {

        var scrambled = genpass.generate({
            length    : 8,
            numbers   : true,
            lowercase : true,
            uppercase : false,
            symbols   : false
        });
        var exists: boolean = await this._service.sharedKeyExists(scrambled);
        while (exists) {
            scrambled = genpass.generate({
                length    : 8,
                numbers   : true,
                lowercase : true,
                uppercase : false,
                symbols   : false
            });
            exists = await this._service.sharedKeyExists(scrambled);
        }

        var link = ConfigurationManager.BaseUrl() + '/api/v1/docs/' + scrambled;
        return { scrambled, link };
    };

    //#endregion

}
