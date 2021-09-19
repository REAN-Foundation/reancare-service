import express from 'express';

import { Helper } from '../../common/helper';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { Authorizer } from '../../auth/authorizer';
import { PersonService } from '../../services/person.service';
import { ApiError } from '../../common/api.error';
import { FileResourceValidator } from '../validators/file.resource.validator';
import { FileResourceService } from '../../services/file.resource.service';
import { RoleService } from '../../services/role.service';
import { FileResourceSearchDownloadDomainModel, FileResourceVersionDomainModel } from '../../domain.types/file.resource/file.resource.domain.model';
import { FileResourceSearchFilters } from '../../domain.types/file.resource/file.resource.search.types';
import { DownloadedFilesDetailsDto } from '../../domain.types/file.resource/file.resource.dto';

import path from 'path';
import fs from 'fs';
import mime from 'mime';
import * as admzip from 'adm-zip';

///////////////////////////////////////////////////////////////////////////////////////

export class FileResourceController {

    //#region member variables and constructors

    _service: FileResourceService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(FileResourceService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    upload = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.Upload';
            await this._authorizer.authorize(request, response);
            
            var domainModel = await FileResourceValidator.upload(request);
            if (!request.files) {
                throw new ApiError(400, 'No file uploaded!!');
            }
            domainModel.Files = request.files;

            var dto = await this._service.upload(domainModel);

            ResponseHandler.success(request, response, 'File/s uploaded successfully!', 201, {
                FileResource : dto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    uploadVersion = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.UploadVersion';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const domainModel: FileResourceVersionDomainModel = await FileResourceValidator.uploadVersion(request);
            if (!request.files) {
                throw new ApiError(400, 'No file uploaded!!');
            }

            domainModel.Files = request.files;
            const dto = await this._service.uploadVersion(domainModel);

            ResponseHandler.success(request, response, 'File version uploaded successfully!', 201, {
                FileResource : dto,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    searchAndDownload = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.SearchAndDownload';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const domainModel: FileResourceSearchDownloadDomainModel =
                await FileResourceValidator.searchAndDownload(request);

            const downloaded: DownloadedFilesDetailsDto = await this._service.searchAndDownload(domainModel);
            if (downloaded.Files === null || downloaded.Files.length === 0) {
                throw new ApiError(404, 'File resources are not found.');
            }

            var zipper = new admzip();
            for await (var f of downloaded.Files) {
                zipper.addLocalFile(f);
            }
            var zipFile = `${downloaded.FolderName}.zip`;
            const data = zipper.toBuffer();
    
            response.set('Content-Type', 'application/octet-stream');
            response.set('Content-Disposition', `attachment; filename=${zipFile}`);
            response.set('Content-Length', data.length);
            response.send(data);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    downloadByVersion = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.DownloadByVersion';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const domainModel: FileResourceVersionDomainModel = await FileResourceValidator.downloadByVersion(request);

            const localDestination = await this._service.downloadByVersion(domainModel);
            if (localDestination == null) {
                throw new ApiError(404, 'FileResource not found.');
            }

            var filename = path.basename(localDestination);
            var mimetype = mime.getType(localDestination);

            response.setHeader('Content-disposition', 'attachment; filename=' + filename);
            response.setHeader('Content-type', mimetype);

            var filestream = fs.createReadStream(localDestination);
            filestream.pipe(response);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    downloadById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.DownloadById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await FileResourceValidator.downloadById(request);

            const localDestination = await this._service.downloadById(id);
            if (localDestination == null) {
                throw new ApiError(404, 'FileResource not found.');
            }

            var filename = path.basename(localDestination);
            var mimetype = mime.getType(localDestination);

            response.setHeader('Content-disposition', 'attachment; filename=' + filename);
            response.setHeader('Content-type', mimetype);

            var filestream = fs.createReadStream(localDestination);
            filestream.pipe(response);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.Search';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const filters: FileResourceSearchFilters = await FileResourceValidator.search(request);

            const address = await this._service.search(filters);
            if (address == null) {
                throw new ApiError(404, 'FileResource not found.');
            }

            ResponseHandler.success(request, response, 'FileResource retrieved successfully!', 200, {
                FileResource : address,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getMetadata = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.GetMetadata';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await FileResourceValidator.getById(request);

            const address = await this._service.getById(id);
            if (address == null) {
                throw new ApiError(404, 'FileResource not found.');
            }

            ResponseHandler.success(request, response, 'FileResource retrieved successfully!', 200, {
                FileResource : address,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteByReference = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.DeleteByReference';
            await this._authorizer.authorize(request, response);

            const referenceId: string = await FileResourceValidator.deleteByReference(request);
            const deleted = await this._service.deleteByReference(referenceId);
            if (!deleted) {
                throw new ApiError(400, 'FileResource cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'FileResource record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            request.context = 'FileResource.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await FileResourceValidator.delete(request);
            const existingFileResource = await this._service.getById(id);
            if (existingFileResource == null) {
                throw new ApiError(404, 'FileResource not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'FileResource cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'FileResource record deleted successfully!', 200, {
                Deleted : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
