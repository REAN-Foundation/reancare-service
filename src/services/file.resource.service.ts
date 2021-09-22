import { inject, injectable } from "tsyringe";
import {
    FileResourceUploadDomainModel,
    FileResourceVersionDomainModel
} from '../domain.types/file.resource/file.resource.domain.model';

import { FileResourceDetailsDto, FileResourceDto } from '../domain.types/file.resource/file.resource.dto';
import { FileResourceSearchResults, FileResourceSearchFilters } from '../domain.types/file.resource/file.resource.search.types';
import { IFileResourceRepo } from "../database/repository.interfaces/file.resource.repo.interface";
import { IFileStorageService } from '../modules/storage/interfaces/file.storage.service.interface';
import { TimeHelper } from "../common/time.helper";

import mime from 'mime';
import path from 'path';
import fs from 'fs';
import * as _ from 'lodash';
import * as sharp from 'sharp';
import { DateStringFormat, DurationType } from "../domain.types/miscellaneous/time.types";
import { ApiError } from "../common/api.error";
import { Logger } from "../common/logger";
import { ConfigurationManager } from "../configs/configuration.manager";
import { FileResourceMetadata } from "../domain.types/file.resource/file.resource.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class FileResourceService {

    constructor(
        @inject('IFileResourceRepo') private _fileResourceRepo: IFileResourceRepo,
        @inject('IFileStorageService') private _storageService: IFileStorageService,
    ) {}

    //#region Publics

    upload = async (domainModel: FileResourceUploadDomainModel): Promise<FileResourceDto> => {

        var resource: FileResourceDetailsDto = null;

        if (domainModel.IsMultiResolutionImage === true) {
            if (!this.isSupportedImageType(domainModel.FileMetadata.MimeType)) {
                Logger.instance().log('Multi-resoulution image type is not supportd!');
            }

            //First add resource definition
            resource = await this.uploadDefaultVersion(domainModel);
            
            var imageVersions = await this.generateImageVersions(domainModel);
            for await (var v of imageVersions) {
                var storageKey = await this.uploadFileToStorage(domainModel.FileMetadata);
                v.StorageKey = storageKey;
                var versionDetails = await this._fileResourceRepo.addVersionDetails(resource.id, v);
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
        var storageKey = await this._storageService.upload(storageLocation, sourceLocation);
        var stats = fs.statSync(sourceLocation);
        var filename = path.basename(sourceLocation);
        
        var metadata: FileResourceMetadata = {
            VersionIdentifier : '1',
            OriginalName      : filename,
            FileName          : filename,
            SourceFilePath    : null,
            MimeType          : mime.lookup(sourceLocation),
            Size              : stats['size'] / 1024,
            StorageKey        : storageKey
        };

        var domainModel: FileResourceUploadDomainModel = {
            FileMetadata           : metadata,
            IsMultiResolutionImage : false,
            MimeType               : mime.lookup(sourceLocation),
            IsPublicResource       : isPublicResource,
        };
        return await this._fileResourceRepo.create(domainModel);
    };

    uploadVersion = async (resourceId, metadata: FileResourceMetadata): Promise<FileResourceDto> => {

        if (metadata.VersionIdentifier === undefined || metadata.VersionIdentifier === null) {
            throw Error('Version identifier found missing!');
        }
        var storageKey = await this.uploadFileToStorage(metadata);
        metadata.StorageKey = storageKey;

        await this._fileResourceRepo.addVersionDetails(resourceId, metadata);

        return await this.getById(resourceId);
    };

    rename = async (id: string, newFileName: string): Promise<boolean> => {

        var resource = await this._fileResourceRepo.getById(id);
        if (resource === null) {
            throw new ApiError(404, "File resource not found!");
        }
        await this._storageService.rename(resource.LatestVersion.StorageKey, newFileName);
        return await this._fileResourceRepo.rename(id, newFileName);
    }

    searchAndDownload = async (filters: FileResourceSearchFilters)
        : Promise<string> => {

        var resources = await this._fileResourceRepo.searchForDownload(filters);
        var timestamp = TimeHelper.timestamp(new Date());
        var tempDownloadFolder = ConfigurationManager.DownloadTemporaryFolder();
        var downloadFolderPath = path.join(tempDownloadFolder, timestamp);

        for await (var resource of resources) {
            var localFilePath = path.join(downloadFolderPath, resource.LatestVersion.FileName);
            await this._storageService.download(resource.LatestVersion.StorageKey, localFilePath);
        }

        return downloadFolderPath;
    };

    downloadByVersion = async (resourceId: string, version: string): Promise<string> => {
        var versionDetails = await this._fileResourceRepo.getVersionDetails(resourceId, version);
        var localDestination = await this._storageService.download(versionDetails.StorageKey);
        return localDestination;
    };

    downloadById = async (id: string): Promise<string> => {
        var dto = await this._fileResourceRepo.getById(id);
        var localDestination = await this._storageService.download(dto.StorageKey);
        return localDestination;
    };

    search = async (filters: FileResourceSearchFilters): Promise<FileResourceSearchResults> => {
        return await this._fileResourceRepo.search(filters);
    };

    getById = async (id: string): Promise<FileResourceDto> => {
        return await this._fileResourceRepo.getById(id);
    };

    getShareableLink = async (id: string, durationInMinutes: number): Promise<string> => {
        var dto = await this._fileResourceRepo.getById(id);
        var storageKey = dto.FileMetadata.StorageKey;
        return await this._storageService.getShareableLink(storageKey, durationInMinutes);
    };

    delete = async (id: string): Promise<boolean> => {

        var versions = await this._fileResourceRepo.getVersions(id);
        for await (var version of versions) {
            var deleted = await this._storageService.delete(version.StorageKey);
            if (deleted) {
                var success = await this._fileResourceRepo.deleteVersion(version.ResourceId, version.Version);
                if (!success) {
                    throw new ApiError(422, "Error deleting version for resource!");
                }
            }
        }
        var versions = await this._fileResourceRepo.getVersions(id);
        if (versions.length > 0) {
            throw new ApiError(422, "Cannot delete all the versions for resource!");
        }
        return await this._fileResourceRepo.delete(id);
    };

    cleanupTempFiles = async () => {
        var tempDownloadFolder = ConfigurationManager.DownloadTemporaryFolder();
        var tempUploadFolder = ConfigurationManager.UploadTemporaryFolder();
        this.cleanupDirectories(tempDownloadFolder);
        this.cleanupDirectories(tempUploadFolder);
    }

    private async uploadDefaultVersion(domainModel: FileResourceUploadDomainModel) {

        var resource = await this._fileResourceRepo.create(domainModel);

        //Add default version
        domainModel.FileMetadata.VersionIdentifier = '1';
        var storageKey = await this.uploadFileToStorage(domainModel.FileMetadata);
        domainModel.FileMetadata.StorageKey = storageKey;

        var versions = [];
        var versionDetails = await this._fileResourceRepo.addVersionDetails(resource.id, domainModel.FileMetadata);
        versions.push(versionDetails);

        resource.Versions = versions;

        return resource;
    }

    //#endregion

    //#region Privates
   
    private async uploadFile(domainModel: FileResourceUploadDomainModel)
        : Promise<FileResourceDto> {

        return await this._fileResourceRepo.create(domainModel);
    }

    private async uploadFileToStorage(fileMetadata: FileResourceMetadata) {
        var dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        var filename = fileMetadata.FileName;
        var storageKey = 'resources/' + dateFolder + '/' + filename;
        await this._storageService.upload(storageKey, fileMetadata.SourceFilePath);
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
                new Date(), cleanupBeforeInMinutes, DurationType.Minutes);

            var directories = getDirectories(parentFolder);
    
            for await (var d of directories) {
                var tmp = new Date();
                tmp.setTime(parseInt(d));
                var createdAt = tmp;
                var isBefore = TimeHelper.isBefore(createdAt, cleanupBefore);
                if (isBefore) {
                    var dPath = path.join(parentFolder, d);
                    fs.rmdirSync(dPath, { recursive: true });
                }
            }
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    
    }

    isSupportedImageType = (mimeType: string): boolean => {
        var supportedTypes = [
            'image/bmp',
            'image/jpeg',
            'image/png',
        ];
        if (supportedTypes.includes(mimeType)) {
            return true;
        }
        return false;
    }

    generateImageVersions = async (domainModel: FileResourceUploadDomainModel): Promise<FileResourceMetadata[]> => {

        var metadata = domainModel.FileMetadata;
        var sourceFilePath = metadata.SourceFilePath;

        var folder = path.dirname(sourceFilePath);
        var extension = path.extname(sourceFilePath);
        var strippedFilename = path.basename(sourceFilePath, extension);

        var width = sharp(sourceFilePath).width;
        var height = sharp(sourceFilePath).height;
        var aspectRatio = width / height;

        var thumbnailHeight = aspectRatio < 1.0 ? 200 : 200 * aspectRatio;
        var thumbnailWidth = aspectRatio < 1.0 ? aspectRatio * 200 : 200;
        var thumbnailFilename = path.join(folder, strippedFilename, '_thumbnail', extension);
        await sharp(sourceFilePath)
            .resize(thumbnailWidth, thumbnailHeight)
            .toFile(thumbnailFilename);
        var thumbnailStats = fs.statSync(thumbnailFilename);

        var previewHeight = aspectRatio < 1.0 ? 640 : 640 * aspectRatio;
        var previewWidth = aspectRatio < 1.0 ? aspectRatio * 640 : 640;
        var previewFilename = path.join(folder, strippedFilename, '_preview', extension);
        await sharp(sourceFilePath)
            .resize(previewWidth, previewHeight)
            .toFile(previewFilename);
        var previewStats = fs.statSync(previewFilename);

        var metadataList: FileResourceMetadata[] = [];

        var thumbnailMetadata: FileResourceMetadata = {
            VersionIdentifier : '1:Thumbnail',
            FileName          : path.basename(thumbnailFilename),
            OriginalName      : path.basename(sourceFilePath),
            SourceFilePath    : thumbnailFilename,
            MimeType          : mime.lookup(thumbnailFilename),
            Size              : thumbnailStats['size'] / 1024,
            StorageKey        : null
        };
        metadataList.push(thumbnailMetadata);

        var previewMetadata: FileResourceMetadata = {
            VersionIdentifier : '1:Preview',
            FileName          : path.basename(previewFilename),
            OriginalName      : path.basename(sourceFilePath),
            SourceFilePath    : previewFilename,
            MimeType          : mime.lookup(previewFilename),
            Size              : previewStats['size'] / 1024,
            StorageKey        : null
        };
        metadataList.push(previewMetadata);

        return metadataList;
    }

    //#endregion

}
