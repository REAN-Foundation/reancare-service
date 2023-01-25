import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Helper } from '../../common/helper';
import { inject, injectable } from "tsyringe";
import { ApiError } from "../../common/api.error";
import { Logger } from "../../common/logger";
import { TimeHelper } from "../../common/time.helper";
import { ConfigurationManager } from "../../config/configuration.manager";
import { IFileResourceRepo } from "../../database/repository.interfaces/general/file.resource.repo.interface";
import { FileResourceUpdateModel, FileResourceUploadDomainModel } from '../../domain.types/general/file.resource/file.resource.domain.model';
import { FileResourceDetailsDto, FileResourceDto } from '../../domain.types/general/file.resource/file.resource.dto';
import { FileResourceSearchFilters, FileResourceSearchResults } from '../../domain.types/general/file.resource/file.resource.search.types';
import { FileResourceMetadata } from "../../domain.types/general/file.resource/file.resource.types";
import { DateStringFormat, DurationType } from "../../domain.types/miscellaneous/time.types";
import { IFileStorageService } from '../../modules/storage/interfaces/file.storage.service.interface';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class FileResourceService {

    constructor(
        @inject('IFileResourceRepo') private _fileResourceRepo: IFileResourceRepo,
        @inject('IFileStorageService') private _storageService: IFileStorageService,
    ) {}

    //#region Publics

    uploadBinary = async (domainModel: FileResourceUploadDomainModel): Promise<FileResourceDto> => {
        return await this.uploadDefaultVersion(domainModel);
    };

    upload = async (domainModel: FileResourceUploadDomainModel): Promise<FileResourceDto> => {

        var resource: FileResourceDetailsDto = null;

        if (domainModel.IsMultiResolutionImage === true) {
            if (!this.isSupportedImageType(domainModel.FileMetadata.MimeType)) {
                Logger.instance().log('Multi-resoulution image type is not supportd!');
            }

            //First add resource definition
            resource = await this.uploadDefaultVersion(domainModel);

            var imageVersions = await this.generateImageVersions(domainModel);
            for await (var versionMetadata of imageVersions) {
                var storageKey = await this.uploadFileToStorage(versionMetadata);
                versionMetadata.StorageKey = storageKey;
                var versionDetails = await this._fileResourceRepo.addVersion(versionMetadata, false);
                versionDetails.StorageKey = null;
                versionDetails.SourceFilePath = null;
                var url = ConfigurationManager.BaseUrl() + '/api/v1/file-resources/' + versionMetadata.ResourceId + '/download-by-version-name/' + versionDetails.Version;
                versionDetails.Url = url;
                resource.Versions.push(versionDetails);
            }
        }
        else {
            resource = await this.uploadDefaultVersion(domainModel);
        }
        return resource;
    };

    uploadLocal = async (
        sourceLocation: string,
        storageLocation: string,
        isPublicResource: boolean
    ): Promise<FileResourceDto> => {

        var exists = fs.existsSync(sourceLocation);
        if (!exists) {
            Logger.instance().log('Source file location does not exist!');
        }

        var storageKey:string = null;
        var existingStorageKey = await this._storageService.exists(storageLocation);
        if (existingStorageKey !== undefined && existingStorageKey !== null) {
            storageKey = existingStorageKey;
        }
        else {
            storageKey = await this._storageService.upload(storageLocation, sourceLocation);
        }

        var stats = fs.statSync(sourceLocation);
        var filename = path.basename(sourceLocation);

        var metadata: FileResourceMetadata = {
            Version        : '1',
            OriginalName   : filename,
            FileName       : filename,
            SourceFilePath : null,
            MimeType       : Helper.getMimeType(sourceLocation),
            Size           : stats['size'] / 1024,
            StorageKey     : storageKey
        };

        var domainModel: FileResourceUploadDomainModel = {
            FileMetadata           : metadata,
            IsMultiResolutionImage : false,
            MimeType               : Helper.getMimeType(sourceLocation),
            IsPublicResource       : isPublicResource,
        };

        var resource = await this._fileResourceRepo.create(domainModel);

        var versions = [];
        domainModel.FileMetadata.ResourceId = resource.id;
        var version = await this._fileResourceRepo.addVersion(domainModel.FileMetadata, true);
        resource.DefaultVersion = version;

        versions.push(version);
        resource.Versions = versions;

        return resource;
    };

    replaceLocal = async (
        fileResourceId: string,
        sourceLocation: string,
        storageLocation: string,
        isPublicResource: boolean
    ): Promise<FileResourceDto> => {

        var exists = fs.existsSync(sourceLocation);
        if (!exists) {
            Logger.instance().log('Source file location does not exist!');
        }
        const dto = await this._fileResourceRepo.getById(fileResourceId);
        if (!dto) {
            return await this.uploadLocal(sourceLocation, storageLocation, isPublicResource);
        }

        var existingStorageKey = await this._storageService.exists(storageLocation);
        if (existingStorageKey) {
            const deleted = await this._storageService.delete(storageLocation);
            Logger.instance().log(`Deleted resource: ${deleted ? 'Yes' : 'No'}`);
        }
        var storageKey = await this._storageService.upload(storageLocation, sourceLocation);

        var stats = fs.statSync(sourceLocation);
        var filename = path.basename(sourceLocation);

        var metadata: FileResourceMetadata = {
            Version        : '1',
            OriginalName   : filename,
            FileName       : filename,
            SourceFilePath : null,
            MimeType       : Helper.getMimeType(sourceLocation),
            Size           : stats['size'] / 1024,
            StorageKey     : storageKey
        };

        var domainModel: FileResourceUploadDomainModel = {
            FileMetadata           : metadata,
            IsMultiResolutionImage : false,
            MimeType               : Helper.getMimeType(sourceLocation),
            IsPublicResource       : isPublicResource,
        };

        const updates: FileResourceUpdateModel = {
            References   : [],
            ResourceId   : fileResourceId,
            FileMetadata : metadata,
        };

        var resource = await this._fileResourceRepo.update(fileResourceId, updates);

        var versions = [];
        domainModel.FileMetadata.ResourceId = resource.id;
        var version = await this._fileResourceRepo.addVersion(domainModel.FileMetadata, true);
        resource.DefaultVersion = version;

        versions.push(version);
        resource.Versions = versions;

        return resource;
    };

    uploadVersion = async (metadata: FileResourceMetadata, makeDefaultVersion: boolean): Promise<FileResourceDto> => {

        if (metadata.Version === undefined || metadata.Version === null) {
            metadata.Version = await this.generateNewVersionIdentifier(metadata.ResourceId);
        }

        var storageKey = await this.uploadFileToStorage(metadata);
        metadata.StorageKey = storageKey;
        await this._fileResourceRepo.addVersion(metadata, makeDefaultVersion);

        return await this.getById(metadata.ResourceId);
    };

    rename = async (id: string, newFileName: string): Promise<boolean> => {

        var resource = await this._fileResourceRepo.getById(id);
        if (resource === null) {
            throw new ApiError(404, "File resource not found!");
        }

        //await this._storageService.rename(resource.DefaultVersion.StorageKey, newFileName);

        return await this._fileResourceRepo.rename(id, newFileName);
    };

    update = async (id: string, updateModel: FileResourceUpdateModel): Promise<FileResourceDto> => {

        var resource = await this._fileResourceRepo.update(id, updateModel);
        if (resource === null) {
            throw new ApiError(404, "File resource not found!");
        }
        return resource;
    };

    searchAndDownload = async (filters: FileResourceSearchFilters)
        : Promise<string> => {

        var resources = await this._fileResourceRepo.searchForDownload(filters);
        var downloadFolderPath = await this.generateDownloadFolderPath();

        for await (var resource of resources) {
            var versionMetadata = resource.DefaultVersion;
            if (!resource.DefaultVersion) {
                versionMetadata = await this._fileResourceRepo.getLatestVersion(resource.id);
            }
            var localFilePath = path.join(downloadFolderPath, resource.FileName); //Always download with resource name
            await this._storageService.download(versionMetadata.StorageKey, localFilePath);
        }

        return downloadFolderPath;
    };

    downloadByVersionName = async (resourceId: string, versionName: string): Promise<string> => {
        var downloadFolderPath = await this.generateDownloadFolderPath();
        var versionMetadata = await this._fileResourceRepo.getVersionByVersionName(resourceId, versionName);
        var localFilePath = path.join(downloadFolderPath, versionMetadata.OriginalName);
        var localDestination = await this._storageService.download(versionMetadata.StorageKey, localFilePath);
        return localDestination;
    };

    downloadByVersionId = async (resourceId: string, versionId: string): Promise<string> => {
        var downloadFolderPath = await this.generateDownloadFolderPath();
        var versionMetadata = await this._fileResourceRepo.getVersionByVersionId(resourceId, versionId);
        var localFilePath = path.join(downloadFolderPath, versionMetadata.OriginalName);
        var localDestination = await this._storageService.download(versionMetadata.StorageKey, localFilePath);
        return localDestination;
    };

    downloadById = async (id: string): Promise<string> => {
        var downloadFolderPath = await this.generateDownloadFolderPath();
        var dto = await this._fileResourceRepo.getById(id);
        if (dto == null) {
            return null;
        }
        var versionMetadata = dto.DefaultVersion;
        if (!dto.DefaultVersion) {
            versionMetadata = await this._fileResourceRepo.getLatestVersion(id);
        }
        var localFilePath = path.join(downloadFolderPath, versionMetadata.OriginalName);
        var localDestination = await this._storageService.download(versionMetadata.StorageKey, localFilePath);
        return localDestination;
    };

    search = async (filters: FileResourceSearchFilters): Promise<FileResourceSearchResults> => {
        return await this._fileResourceRepo.search(filters);
    };

    getById = async (id: string): Promise<FileResourceDetailsDto> => {
        return await this._fileResourceRepo.getById(id);
    };

    getVersionByVersionId = async (id: string, versionId: string): Promise<FileResourceMetadata> => {
        var version = await this._fileResourceRepo.getVersionByVersionId(id, versionId);
        version.SourceFilePath = null;
        version.StorageKey = null;
        var url = ConfigurationManager.BaseUrl() + '/api/v1/file-resources/' + id + '/download-by-version-id/' + version.VersionId;
        version.Url = url;
        return version;
    };

    getVersionByVersionName = async (id: string, versionName: string): Promise<FileResourceMetadata> => {
        var version = await this._fileResourceRepo.getVersionByVersionId(id, versionName);
        version.SourceFilePath = null;
        version.StorageKey = null;
        var url = ConfigurationManager.BaseUrl() + '/api/v1/file-resources/' + id + '/download-by-version-name/' + version.Version;
        version.Url = url;
        return version;
    };

    getLatestVersion = async (id: string): Promise<FileResourceMetadata> => {
        var version = await this._fileResourceRepo.getLatestVersion(id);
        version.SourceFilePath = null;
        version.StorageKey = null;
        var url = ConfigurationManager.BaseUrl() + '/api/v1/file-resources/' + id + '/download-by-version-id/' + version.VersionId;
        version.Url = url;
        return version;
    };

    getVersions = async (id: string): Promise<FileResourceMetadata[]> => {
        return await this._fileResourceRepo.getVersions(id);
    };

    getShareableLink = async (id: string, durationInMinutes: number): Promise<string> => {
        var dto = await this._fileResourceRepo.getById(id);
        var storageKey = dto.DefaultVersion.StorageKey;
        return await this._storageService.getShareableLink(storageKey, durationInMinutes);
    };

    delete = async (id: string): Promise<boolean> => {

        var versions = await this._fileResourceRepo.getVersions(id);
        for await (var version of versions) {
            var deleted = await this._storageService.delete(version.StorageKey);
            if (!deleted) {
                throw new ApiError(422, "Error deleting version for resource!");
            }
        }
        return await this._fileResourceRepo.delete(id);
    };

    deleteVersionByVersionId = async (id: string, versionId: string): Promise<boolean> => {

        var versionMetadata = await this._fileResourceRepo.getVersionByVersionId(id, versionId);
        var deleted = await this._storageService.delete(versionMetadata.StorageKey);
        if (!deleted) {
            throw new ApiError(422, "Error deleting version for resource!");
        }
        return await this._fileResourceRepo.deleteVersionByVersionId(id, versionId);
    };

    cleanupTempFiles = async () => {
        var tempDownloadFolder = ConfigurationManager.DownloadTemporaryFolder();
        var tempUploadFolder = ConfigurationManager.UploadTemporaryFolder();
        this.cleanupDirectories(tempDownloadFolder);
        this.cleanupDirectories(tempUploadFolder);
    };

    //#endregion

    //#region Privates

    private generateDownloadFolderPath = async() => {

        var timestamp = TimeHelper.timestamp(new Date());
        var tempDownloadFolder = ConfigurationManager.DownloadTemporaryFolder();
        var downloadFolderPath = path.join(tempDownloadFolder, timestamp);

        //Make sure the path exists
        await fs.promises.mkdir(downloadFolderPath, { recursive: true });

        return downloadFolderPath;
    };

    private async uploadDefaultVersion(domainModel: FileResourceUploadDomainModel) {

        var resource = await this._fileResourceRepo.create(domainModel);

        //Add default version
        domainModel.FileMetadata.Version = '1';
        var storageKey = await this.uploadFileToStorage(domainModel.FileMetadata);
        domainModel.FileMetadata.StorageKey = storageKey;

        var versions = [];
        domainModel.FileMetadata.ResourceId = resource.id;
        var version = await this._fileResourceRepo.addVersion(domainModel.FileMetadata, true);
        resource.DefaultVersion = version;

        versions.push(version);
        resource.Versions = versions;

        return resource;
    }

    private async uploadFileToStorage(fileMetadata: FileResourceMetadata) {

        var dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        var filename = fileMetadata.FileName;
        var storageKey = 'resources/' + dateFolder + '/' + filename;
        if (fileMetadata.Stream) {
            await this._storageService.uploadStream(storageKey, fileMetadata.Stream);
        }
        else {
            await this._storageService.upload(storageKey, fileMetadata.SourceFilePath);
        }
        return storageKey;
    }

    private async cleanupDirectories(parentFolder) {

        try {
            const getDirectories = source =>
                fs.readdirSync(source, { withFileTypes: true })
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);

            var cleanupBeforeInMinutes = ConfigurationManager.TemporaryFolderCleanupBefore();

            var cleanupBefore = TimeHelper.subtractDuration(
                new Date(), cleanupBeforeInMinutes, DurationType.Minute);

            var directories = getDirectories(parentFolder);

            for await (var d of directories) {
                const dirPath = path.join(parentFolder, d);
                const directoryContents = fs.readdirSync(dirPath, { withFileTypes: true });
                for await (var c of directoryContents) {
                    const cPath = path.join(dirPath, c.name);
                    const stats = fs.statSync(cPath);
                    const createdDateTime = stats.ctime;
                    var isBefore = TimeHelper.isBefore(createdDateTime, cleanupBefore);
                    if (isBefore) {
                        fs.rmSync(cPath, { recursive: true });
                    }
                }
                const contents = fs.readdirSync(dirPath, { withFileTypes: true });
                if (contents.length === 0) {
                    fs.rmSync(dirPath, { recursive: true });
                }
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }

    }

    private isSupportedImageType = (mimeType: string): boolean => {
        var supportedTypes = [
            'image/bmp',
            'image/jpeg',
            'image/png',
        ];
        if (supportedTypes.includes(mimeType)) {
            return true;
        }
        return false;
    };

    private generateNewVersionIdentifier = async (ResourceId: string): Promise<string> => {

        var versionNames = await this._fileResourceRepo.getVersionNames(ResourceId);
        var count = versionNames.length + 1;
        var versionName = count.toString();
        while (versionNames.includes(versionName)) {
            count++;
            versionName = count.toString();
        }
        return versionName;
    };

    private generateImageVersions = async (domainModel: FileResourceUploadDomainModel)
        : Promise<FileResourceMetadata[]> => {

        var metadata = domainModel.FileMetadata;
        var sourceFilePath = metadata.SourceFilePath;

        var folder = path.dirname(sourceFilePath);
        var extension = path.extname(sourceFilePath);
        var strippedFilename = path.basename(sourceFilePath, extension);

        var imageMetadata = await sharp(sourceFilePath).metadata();
        var width = imageMetadata.width;
        var height = imageMetadata.height;
        var aspectRatio = width / height;

        var metadataList: FileResourceMetadata[] = [];

        var thumbnailHeight = aspectRatio < 1.0 ? 200 : Math.floor(200 * aspectRatio);
        var thumbnailWidth = aspectRatio < 1.0 ?  Math.floor(aspectRatio * 200) : 200;
        var tempFile = strippedFilename + '_thumbnail' + extension;
        var thumbnailFilename = path.join(folder, tempFile);
        await sharp(sourceFilePath)
            .resize(thumbnailWidth, thumbnailHeight)
            .toFile(thumbnailFilename);
        var thumbnailStats = fs.statSync(thumbnailFilename);

        var thumbnailMetadata: FileResourceMetadata = {
            ResourceId     : metadata.ResourceId,
            Version        : '1:Thumbnail',
            FileName       : path.basename(thumbnailFilename),
            OriginalName   : path.basename(sourceFilePath),
            SourceFilePath : thumbnailFilename,
            MimeType       : Helper.getMimeType(thumbnailFilename),
            Size           : thumbnailStats['size'] / 1024,
            StorageKey     : null
        };
        metadataList.push(thumbnailMetadata);

        var previewHeight = aspectRatio < 1.0 ? 640 : Math.floor(640 * aspectRatio);
        var previewWidth = aspectRatio < 1.0 ? Math.floor(aspectRatio * 640) : 640;
        tempFile = strippedFilename + '_preview' + extension;
        var previewFilename = path.join(folder, tempFile);
        await sharp(sourceFilePath)
            .resize(previewWidth, previewHeight)
            .toFile(previewFilename);
        var previewStats = fs.statSync(previewFilename);

        var previewMetadata: FileResourceMetadata = {
            ResourceId     : metadata.ResourceId,
            Version        : '1:Preview',
            FileName       : path.basename(previewFilename),
            OriginalName   : path.basename(sourceFilePath),
            SourceFilePath : previewFilename,
            MimeType       : Helper.getMimeType(previewFilename),
            Size           : previewStats['size'] / 1024,
            StorageKey     : null
        };
        metadataList.push(previewMetadata);

        return metadataList;
    };

    //#endregion

}
