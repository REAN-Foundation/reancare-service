import express from 'express';
import fs from 'fs';
import path from 'path';
import { Authenticator } from '../../../auth/authenticator';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { TimeHelper } from '../../../common/time.helper';
import { FileResourceDetailsDto, FileResourceDto } from '../../../domain.types/general/file.resource/file.resource.dto';
import { FileResourceSearchFilters } from '../../../domain.types/general/file.resource/file.resource.search.types';
import { DownloadDisposition, FileResourceMetadata } from '../../../domain.types/general/file.resource/file.resource.types';
import { FileResourceService } from '../../../services/general/file.resource.service';
import { PersonService } from '../../../services/person/person.service';
import { RoleService } from '../../../services/role/role.service';
import { Loader } from '../../../startup/loader';
import { FileResourceValidator } from './file.resource.validator';
import AdmZip from 'adm-zip';
import { Helper } from '../../../common/helper';
import { FileResourceUploadDomainModel } from '../../../domain.types/general/file.resource/file.resource.domain.model';
import { Logger } from '../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class FileResourceController {

    //#region member variables and constructors

    _service: FileResourceService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _authorizer: Authorizer = null;

    _authenticator: Authenticator = null;

    _validator: FileResourceValidator = new FileResourceValidator();

    constructor() {
        this._service = Loader.container.resolve(FileResourceService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._authorizer = Loader.authorizer;
        this._authenticator = Loader.authenticator;
    }

    //#endregion

    //#region Action methods

    uploadBinary = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.Upload';
            await this._authorizer.authorize(request, response);

            const model: FileResourceUploadDomainModel = this.getBinaryUploadModel(request);

            const dtos = [];
            const dto = await this._service.uploadBinary(model);
            dtos.push(this.sanitizeDto(dto));

            ResponseHandler.success(request, response, 'File resource uploaded successfully!', 201, {
                FileResources : dtos,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    upload = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.Upload';
            await this._authorizer.authorize(request, response);

            var domainModels = await this._validator.upload(request);

            if (domainModels.length === 0) {
                throw new ApiError(400, 'File resource not found!');
            }
            var dtos = [];
            for await (var model of domainModels) {
                var dto = await this._service.upload(model);
                dtos.push(this.sanitizeDto(dto));
            }

            ResponseHandler.success(request, response, 'File resource uploaded successfully!', 201, {
                FileResources : dtos,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.Update';
            await this._authorizer.authorize(request, response);

            var updateModel = await this._validator.update(request);
            var dto = await this._service.update(updateModel.ResourceId, updateModel);
            dto = this.sanitizeDto(dto);
            ResponseHandler.success(request, response, 'File resource updated successfully!', 200, {
                FileResource : dto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    uploadVersion = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.UploadVersion';

            await this._authorizer.authorize(request, response);

            const metadata: FileResourceMetadata = await this._validator.uploadVersion(request);
            var dto = await this._service.uploadVersion(metadata, metadata.IsDefaultVersion);
            dto = this.sanitizeDto(dto);

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

            await this._authorizer.authorize(request, response);

            const model = await this._validator.rename(request);
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

            await this._authorizer.authorize(request, response);

            const filters: FileResourceSearchFilters =
                await this._validator.search(request);

            const downloadedFolder = await this._service.searchAndDownload(filters);
            var filenames = fs.readdirSync(downloadedFolder);
            if (filenames.length === 0) {
                throw new ApiError(404, 'File resources are not found.');
            }

            var zipper = new AdmZip();
            for await (var f of filenames) {
                var fullFilePath = path.join(downloadedFolder, f);
                zipper.addLocalFile(fullFilePath);
            }
            var timestamp = TimeHelper.timestamp(new Date());
            var zipFile = `${timestamp}.zip`;
            const data = zipper.toBuffer();

            response.set('Content-Type', 'application/octet-stream');
            response.set('Content-Disposition', `attachment; filename=${zipFile}`);
            response.set('Content-Length', data.length.toString());
            response.send(data);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    downloadByVersionName = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.DownloadByVersionName';
            const metadata: FileResourceMetadata = await this._validator.getByVersionName(request);
            var resource = await this._service.getById(metadata.ResourceId);

            if (resource.IsPublicResource === false) {

                //NOTE: Please note that this is deviation from regular pattern of
                //authentication middleware pipeline. Here we are authenticating client
                //and user only when the file resource is not public.

                await this._authenticator.checkAuthentication(request);
                await this._authorizer.authorize(request, response);
            }

            Logger.instance().log(`Download request for Resource Id:: ${metadata.ResourceId}
                and Version:: ${metadata.Version}`);
            const localDestination = await this._service.downloadByVersionName(
                metadata.ResourceId,
                metadata.Version);

            this.streamToResponse(localDestination, response, metadata);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    downloadByVersionId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.DownloadByVersionId';
            const metadata: FileResourceMetadata = await this._validator.getByVersionId(request);
            var resource = await this._service.getById(metadata.ResourceId);

            if (resource.IsPublicResource === false) {

                //NOTE: Please note that this is deviation from regular pattern of
                //authentication middleware pipeline. Here we are authenticating client
                //and user only when the file resource is not public.

                await this._authenticator.checkAuthentication(request);
                await this._authorizer.authorize(request, response);
            }

            const localDestination = await this._service.downloadByVersionId(
                metadata.ResourceId,
                metadata.VersionId);

            this.streamToResponse(localDestination, response, metadata);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    downloadById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.DownloadById';
            const metadata = await this._validator.downloadById(request);
            var resource = await this._service.getById(metadata.ResourceId);

            if (resource.IsPublicResource === false) {

                //NOTE: Please note that this is deviation from regular pattern of
                //authentication middleware pipeline. Here we are authenticating client
                //and user only when the file resource is not public.

                await this._authenticator.checkAuthentication(request);
                await this._authorizer.authorize(request, response);
            }

            const localDestination = await this._service.downloadById(metadata.ResourceId);
            this.streamToResponse(localDestination, response, metadata);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.Search';

            await this._authorizer.authorize(request, response);

            const filters: FileResourceSearchFilters = await this._validator.search(request);

            var searchResults = await this._service.search(filters);
            if (searchResults == null) {
                throw new ApiError(404, 'File resource not found.');
            }

            searchResults.Items = searchResults.Items.map(x => {
                return this.sanitizeDto(x);
            });

            ResponseHandler.success(request, response, 'File resource retrieved successfully!', 200, {
                FileResources : searchResults,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getVersionById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.GetVersionById';

            await this._authorizer.authorize(request, response);

            const metadata: FileResourceMetadata = await this._validator.getByVersionId(request);

            const versionMetadata = await this._service.getVersionByVersionId(
                metadata.ResourceId,
                metadata.VersionId);

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

            await this._authorizer.authorize(request, response);

            const id: string = await this._validator.getById(request);

            const versions = await this._service.getVersions(id);
            if (versions === null || versions.length === 0) {
                throw new ApiError(404, 'File resource versions are not found.');
            }

            //Sanitize the metadata before sending
            var sanitizedVersions = versions.map(x => {
                if (x === null) {
                    return null;
                }
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

            await this._authorizer.authorize(request, response);

            const id: string = await this._validator.getById(request);

            var dto = await this._service.getById(id);
            if (dto == null) {
                throw new ApiError(404, 'File resource not found.');
            }
            dto = this.sanitizeDetailsDto(dto);

            ResponseHandler.success(request, response, 'File resource retrieved successfully!', 200, {
                FileResource : dto,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            request.context = 'FileResource.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await this._validator.delete(request);
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

            const metadata: FileResourceMetadata = await this._validator.getByVersionId(request);

            const deleted = await this._service.deleteVersionByVersionId(metadata.ResourceId, metadata.VersionId);
            if (!deleted) {
                throw new ApiError(400, 'File resource version cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'File resource version deleted successfully!', 200, {
                Deleted : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private getBinaryUploadModel(request: express.Request) {
        var filename = request.headers["filename"] as string;
        var publicResource = request.headers['public'] === 'true' ? true : false;
        const sizeStr = request.headers['size'] ? request.headers['size'] as string : null;
        var size = sizeStr ? parseInt(sizeStr)  : 0;

        const metadata: FileResourceMetadata = {
            FileName     : filename,
            OriginalName : filename,
            MimeType     : Helper.getMimeType(filename),
            Version      : '1',
            StorageKey   : null,
            Stream       : request,
            Size         : size,
        };
        const model: FileResourceUploadDomainModel = {
            FileMetadata           : metadata,
            OwnerUserId            : request.body.OwnerUserId ?? request.currentUser.UserId,
            UploadedByUserId       : request.currentUser.UserId,
            IsPublicResource       : publicResource,
            IsMultiResolutionImage : false,
            MimeType               : Helper.getMimeType(filename),
        };
        return model;
    }

    //#endregion

    //#region Privates

    private streamToResponse(
        localDestination: string,
        response: express.Response<any, Record<string, any>>,
        metadata: FileResourceMetadata) {

        if (localDestination == null) {
            throw new ApiError(404, 'File resource not found.');
        }

        var filename = path.basename(localDestination);
        var mimetype = metadata.MimeType ?? Helper.getMimeType(localDestination);
        if (!mimetype) {
            mimetype = 'text/plain';
        }

        this.setDownloadResponseHeaders(response, metadata.Disposition, mimetype, filename);

        var filestream = fs.createReadStream(localDestination);
        filestream.pipe(response);
    }

    private sanitizeDto(dto: FileResourceDto): FileResourceDto {
        if (dto !== null && dto.DefaultVersion) {
            dto.DefaultVersion.StorageKey = null;
            dto.DefaultVersion.SourceFilePath = null;
        }
        return dto;
    }

    private sanitizeDetailsDto(dto: FileResourceDetailsDto): FileResourceDetailsDto {
        if (dto && dto.DefaultVersion) {
            dto.DefaultVersion.StorageKey = null;
        }
        if (dto.Versions && dto.Versions.length > 0) {
            dto.Versions.forEach(x => {
                if (x !== null) {
                    x.StorageKey = null;
                    x.SourceFilePath = null;
                }
            });
        }
        return dto;
    }

    private setDownloadResponseHeaders(
        response: express.Response,
        disposition: DownloadDisposition,
        mimeType: string,
        filename: string) {

        response.setHeader('Content-type', mimeType);

        if (disposition === DownloadDisposition.Attachment) {
            response.setHeader('Content-disposition', 'attachment; filename=' + filename);
        }
        else if (disposition === DownloadDisposition.Inline ||
            (mimeType === 'image/jpeg' ||
            mimeType === 'image/png' ||
            mimeType === 'image/bmp')) {
            response.setHeader('Content-disposition', 'inline');
        }
        else {
            response.setHeader('Content-disposition', 'attachment; filename=' + filename);
        }

    }

    //#endregion

}
