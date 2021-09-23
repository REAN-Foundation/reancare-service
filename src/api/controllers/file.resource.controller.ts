import express from 'express';
import path from 'path';
import fs from 'fs';
import mime from 'mime';
import * as admzip from 'adm-zip';

import { Helper } from '../../common/helper';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { Authorizer } from '../../auth/authorizer';
import { PersonService } from '../../services/person.service';
import { ApiError } from '../../common/api.error';
import { FileResourceValidator } from '../validators/file.resource.validator';
import { FileResourceService } from '../../services/file.resource.service';
import { RoleService } from '../../services/role.service';
import { FileResourceSearchFilters } from '../../domain.types/file.resource/file.resource.search.types';
import { FileResourceMetadata } from '../../domain.types/file.resource/file.resource.types';
import { TimeHelper } from '../../common/time.helper';

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
            
            var domainModels = await FileResourceValidator.upload(request);

            var dtos = [];
            for await (var model of domainModels) {
                const dto = await this._service.upload(model);
                dtos.push(dto);
            }
            
            ResponseHandler.success(request, response, 'File/s uploaded successfully!', 201, {
                FileResources : dtos,
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

            const metadata: FileResourceMetadata = await FileResourceValidator.uploadVersion(request);
            const dto = await this._service.uploadVersion(metadata, metadata.IsDefaultVersion);

            ResponseHandler.success(request, response, 'File version uploaded successfully!', 201, {
                FileResource : dto,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    rename = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.Rename';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const model = await FileResourceValidator.rename(request);
            if (model.NewFileName === null) {
                throw new ApiError(400, "Invalid file name!");
            }

            const renamed = await this._service.rename(model.id, model.NewFileName);

            ResponseHandler.success(request, response, 'File renamed successfully!', 200, {
                Renamed : renamed,
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

            const filters: FileResourceSearchFilters =
                await FileResourceValidator.search(request);

            const downloadedFolder = await this._service.searchAndDownload(filters);
            var filenames = fs.readdirSync(downloadedFolder);
            if (filenames.length === 0) {
                throw new ApiError(404, 'File resources are not found.');
            }

            var zipper = new admzip();
            for await (var f of filenames) {
                var fullFilePath = path.join(downloadedFolder, f);
                zipper.add(fullFilePath);
            }
            var timestamp = TimeHelper.timestamp(new Date());
            var zipFile = `${timestamp}.zip`;
            const data = zipper.toBuffer();
    
            response.set('Content-Type', 'application/octet-stream');
            response.set('Content-Disposition', `attachment; filename=${zipFile}`);
            response.set('Content-Length', data.length);
            response.send(data);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    downloadByVersionName = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.DownloadByVersionName';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);

            const metadata: FileResourceMetadata = await FileResourceValidator.getByVersionName(request);
            var resource = await this._service.getById(metadata.ResourceId);
            if (!metadata.IsPublicResource || resource.IsPublicResource === false) {
                await this._authorizer.authorize(request, response);
            }

            const localDestination = await this._service.downloadByVersionName(
                metadata.ResourceId,
                metadata.Version);

            this.streamDownloadedFileInResponse(localDestination, response);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    downloadByVersionId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.DownloadByVersionId';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);

            const metadata: FileResourceMetadata = await FileResourceValidator.getByVersionId(request);
            var resource = await this._service.getById(metadata.ResourceId);
            if (!metadata.IsPublicResource || resource.IsPublicResource === false) {
                await this._authorizer.authorize(request, response);
            }

            const localDestination = await this._service.downloadByVersionId(
                metadata.ResourceId,
                metadata.Version);

            this.streamDownloadedFileInResponse(localDestination, response);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    downloadById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.DownloadById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);

            const metadata = await FileResourceValidator.downloadById(request);
            var resource = await this._service.getById(metadata.ResourceId);
            if (!metadata.IsPublicResource || resource.IsPublicResource === false) {
                await this._authorizer.authorize(request, response);
            }
            
            const localDestination = await this._service.downloadById(metadata.ResourceId);
            if (localDestination === undefined) {
                throw new ApiError(404, 'File resource not found.');
            }

            var filename = path.basename(localDestination);
            var mimetype = mime.lookup(localDestination);

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

            const resource = await this._service.search(filters);
            if (resource == null) {
                throw new ApiError(404, 'File resource not found.');
            }

            ResponseHandler.success(request, response, 'File resource retrieved successfully!', 200, {
                FileResource : resource,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getVersionById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.GetVersionById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const metadata: FileResourceMetadata = await FileResourceValidator.getByVersionId(request);
            
            const versionMetadata = await this._service.getVersionByVersionId(
                metadata.ResourceId,
                metadata.Version);

            if (versionMetadata == null) {
                throw new ApiError(404, 'File resource version not found.');
            }

            //Sanitize the metadata before sending
            versionMetadata.StorageKey = null;
            versionMetadata.SourceFilePath = null;

            ResponseHandler.success(request, response, 'File resource version retrieved successfully!', 200, {
                FileResourceVersion : versionMetadata,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
   
    getVersions = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.GetVersions';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await FileResourceValidator.getById(request);

            const versions = await this._service.getVersions(id);
            if (versions === null || versions.length === 0) {
                throw new ApiError(404, 'File resource versions are not found.');
            }

            //Sanitize the metadata before sending
            var sanitizedVersions = versions.map(x => {
                x.StorageKey = null;
                x.SourceFilePath = null;
                return x;
            });

            ResponseHandler.success(request, response, 'File resource versions retrieved successfully!', 200, {
                FileResourceVersions : sanitizedVersions,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    getResourceInfo = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.GetResourceInfo';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await FileResourceValidator.getById(request);

            const resource = await this._service.getById(id);
            if (resource == null) {
                throw new ApiError(404, 'File resource not found.');
            }

            ResponseHandler.success(request, response, 'File resource retrieved successfully!', 200, {
                FileResource : resource,
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
                throw new ApiError(404, 'File resource not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'File resource cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'File resource record deleted successfully!', 200, {
                Deleted : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    deleteVersionByVersionId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            request.context = 'FileResource.DeleteVersionByVersionId';
            await this._authorizer.authorize(request, response);

            const metadata: FileResourceMetadata = await FileResourceValidator.getByVersionId(request);

            const deleted = await this._service.deleteVersionByVersionId(metadata.ResourceId, metadata.VersionId);
            if (!deleted) {
                throw new ApiError(400, 'File resource cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'File resource version deleted successfully!', 200, {
                Deleted : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    private streamDownloadedFileInResponse(
        localDestination: string,
        response: express.Response<any, Record<string, any>>) {

        if (localDestination == null) {
            throw new ApiError(404, 'File resource not found.');
        }

        var filename = path.basename(localDestination);
        var mimetype = mime.lookup(localDestination);

        response.setHeader('Content-disposition', 'attachment; filename=' + filename);
        response.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(localDestination);
        filestream.pipe(response);
    }

    //#endregion

}
