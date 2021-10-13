import express from 'express';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { DocumentTypesList } from '../../../domain.types/patient/document/document.types';
import { DocumentService } from '../../../services/patient/document.service';
import { Loader } from '../../../startup/loader';
import { DocumentValidator } from '../../validators/patient/document.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class DocumentController {

    //#region member variables and constructors

    _service: DocumentService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(DocumentService);
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
            
            const documentDomainModel = await DocumentValidator.upload(request);

            const document = await this._service.create(documentDomainModel);
            if (document == null) {
                throw new ApiError(400, 'Cannot create document!');
            }

            ResponseHandler.success(request, response, 'Document created successfully!', 201, {
                PatientDocument : document,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await DocumentValidator.getById(request);

            const Document = await this._service.getById(id);
            if (Document == null) {
                throw new ApiError(404, ' Document not found.');
            }

            ResponseHandler.success(request, response, 'Document retrieved successfully!', 200, {
                Document : Document,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.Update';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const domainModel = await DocumentValidator.update(request);
            const id: string = await DocumentValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Document not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update document!');
            }

            ResponseHandler.success(request, response, 'Document updated successfully!', 200, {
                Document : updated,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.Search';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const domainModel = await DocumentValidator.update(request);
            const id: string = await DocumentValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Document not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update document!');
            }

            ResponseHandler.success(request, response, 'Document updated successfully!', 200, {
                Document : updated,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    rename = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.Rename';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const domainModel = await DocumentValidator.update(request);
            const id: string = await DocumentValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Document not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update document!');
            }

            ResponseHandler.success(request, response, 'Document updated successfully!', 200, {
                Document : updated,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    download = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.Download';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const domainModel = await DocumentValidator.update(request);
            const id: string = await DocumentValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Document not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update document!');
            }

            ResponseHandler.success(request, response, 'Document updated successfully!', 200, {
                Document : updated,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    share = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.Share';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const domainModel = await DocumentValidator.update(request);
            const id: string = await DocumentValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Document not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update document!');
            }

            ResponseHandler.success(request, response, 'Document updated successfully!', 200, {
                PatientDocumentLink : updated,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientDocument.Delete';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await DocumentValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Document not found.');
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

    //#endregion

}
