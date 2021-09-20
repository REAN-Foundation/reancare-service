import { inject, injectable } from "tsyringe";
import {
    FileResourceMetadata,
    FileResourceSearchDownloadDomainModel,
    FileResourceUploadDomainModel,
    FileResourceVersionDomainModel
} from '../domain.types/file.resource/file.resource.domain.model';

import { DownloadedFilesDetailsDto, FileResourceDto } from '../domain.types/file.resource/file.resource.dto';
import { FileResourceSearchResults, FileResourceSearchFilters } from '../domain.types/file.resource/file.resource.search.types';
import { IFileResourceRepo } from "../database/repository.interfaces/file.resource.repo.interface";
import { IFileStorageService } from '../modules/storage/interfaces/file.storage.service.interface';
import { ITimeService } from "../modules/time/interfaces/time.service.interface";

import * as express from 'express-fileupload';
import mime from 'mime';
import path from 'path';
import fs from 'fs';
import * as _ from 'lodash';
import { Helper } from "../common/helper";
import { DateStringFormat, DurationType } from "../modules/time/interfaces/time.types";
import { ApiError } from "../common/api.error";
import { Logger } from "../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

const TEMP_UPLOAD_FOLDER = path.join(process.cwd(), './tmp/resources/uploads/');
const TEMP_DOWNLOAD_FOLDER = path.join(process.cwd(), './tmp/resources/downloads/');
const CLEANUP_DURATION = 10;

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class FileResourceService {

    constructor(
        @inject('IFileResourceRepo') private _fileResourceRepo: IFileResourceRepo,
        @inject('IFileStorageService') private _storageService: IFileStorageService,
        @inject('ITimeService') private _timeService: ITimeService,
    ) {}

    //#region Publics

    upload = async (domainModel: FileResourceUploadDomainModel): Promise<FileResourceDto> => {
        
        var timestamp = this._timeService.timestamp(new Date());
        var folderPath = path.join(TEMP_UPLOAD_FOLDER, timestamp);
        var fileMetadataList = this.storeLocally(folderPath, domainModel.Files);
        if (fileMetadataList.length === 0) {
            return null;
        }
        var file = fileMetadataList[0]; //Only take the first file - single upload
        return await this.uploadFile(file, domainModel);
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
        var domainModel: FileResourceUploadDomainModel = {
            StorageKey             : storageKey,
            IsMultiResolutionImage : false,
            MimeType               : mime.lookup(sourceLocation),
            SizeInKB               : stats['size'] / 1024,
            IsPublicResource       : isPublicResource,
            FileNames              : [filename]
        };
        return await this._fileResourceRepo.create(domainModel);
    };

    uploadMultiple = async (domainModel: FileResourceUploadDomainModel): Promise<FileResourceDto[]> => {
        
        var uploaded: FileResourceDto[] = [];
        var timestamp = this._timeService.timestamp(new Date());
        var folderPath = path.join(TEMP_UPLOAD_FOLDER, timestamp);
        var fileMetadataList = this.storeLocally(folderPath, domainModel.Files);

        for await (var file of fileMetadataList) {
            var dto = await this.uploadFile(file, domainModel);
            uploaded.push(dto);
        }

        return uploaded;
    };

    uploadVersion = async (domainModel: FileResourceVersionDomainModel): Promise<FileResourceDto> => {

        var timestamp = this._timeService.timestamp(new Date());
        var folderPath = path.join(TEMP_UPLOAD_FOLDER, timestamp);
        var fileMetadataList = this.storeLocally(folderPath, domainModel.Files);
        if (fileMetadataList.length === 0) {
            return null;
        }
        var file = fileMetadataList[0];
        var storageKey = await this.uploadFileToStorage(file);
        domainModel.StorageKey = storageKey;
        domainModel.MimeType = file.MimeType,
        domainModel.SizeInKB = (file.Size) / 1024;

        return await this._fileResourceRepo.addVersionDetails(domainModel);
    };

    rename = async (id: string, newFileName: string): Promise<boolean> => {
        var resourceDto = await this._fileResourceRepo.getById(id);
        if (resourceDto === null) {
            throw new ApiError(404, "File resource not found!");
        }
        await this._storageService.rename(resourceDto.StorageKey, newFileName);
        return await this._fileResourceRepo.rename(id, newFileName);
    }

    searchAndDownload = async (filters: FileResourceSearchDownloadDomainModel)
        : Promise<DownloadedFilesDetailsDto> => {

        var downloads = await this._fileResourceRepo.searchForDownload(filters);
        var timestamp = this._timeService.timestamp(new Date());
        var downloadFolderPath = path.join(TEMP_DOWNLOAD_FOLDER, timestamp);

        for await (var file of downloads.Files) {
            var localFilePath = path.join(downloadFolderPath, file.FileName);
            var localDestination = await this._storageService.download(file.StorageKey, localFilePath);
            file.DownloadedLocalPath = localDestination;
        }
        downloads.LocalFolderName = downloadFolderPath;
        return downloads;
    };

    downloadByVersion = async (domainModel: FileResourceVersionDomainModel): Promise<string> => {
        var versionDetails = await this._fileResourceRepo.getVersionDetails(domainModel);
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
        var storageKey = dto.StorageKey;
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
        this.cleanupDirectories(TEMP_UPLOAD_FOLDER);
        this.cleanupDirectories(TEMP_DOWNLOAD_FOLDER);
    }

    //#endregion

    //#region Privates

    private storeLocally = (tempFolder: string, files: express.FileArray): FileResourceMetadata[] => {

        var metadataDetails = [];
        _.forEach(_.keysIn(files), (key) => {
            const file = files[key];
            if (Array.isArray(file)) {
                var fileArray = file;
                for (var fileElement of fileArray) {
                    var metadata = this.moveToTempFolder(tempFolder, fileElement);
                    metadataDetails.push(metadata);
                }
            }
            else {
                var metadata = this.moveToTempFolder(tempFolder, file);
                metadataDetails.push(metadata);
            }
        });
        return metadataDetails;
    }

    private moveToTempFolder = (folder, file): FileResourceMetadata => {

        var timestamp = this._timeService.timestamp(new Date());
        var filename = file.name;
        var ext = Helper.getFileExtension(filename);
    
        filename = filename.replace('.' + ext, "");
        filename = filename.replace(' ', "_");
        filename = filename + '_' + timestamp + '.' + ext;
        var tempFilename = path.join(folder, filename);
    
        var moveIt = async (m, tempFilename) => {
    
            return new Promise((resolve, reject) => {
                m.mv(tempFilename, function (error) {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(true);
                });
            });
    
        };
    
        (async () => {
            await moveIt(file, tempFilename);
        })();
    
        var metadata: FileResourceMetadata = {
            FileName     : filename,
            FilePath     : tempFilename,
            OriginalName : file.name,
            MimeType     : mime.lookup(tempFilename),
            Size         : file.size
        };
        return metadata;
    }
    
    private async uploadFile(file: FileResourceMetadata, domainModel: FileResourceUploadDomainModel) {
        var storageKey = await this.uploadFileToStorage(file);
        domainModel.StorageKey = storageKey;
        domainModel.MimeType = file.MimeType,
        domainModel.SizeInKB = (file.Size) / 1024;
        return await this._fileResourceRepo.create(domainModel);
    }

    private async uploadFileToStorage(file: FileResourceMetadata) {
        var dateFolder = this._timeService.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        var filename = file.FileName;
        var filepath = file.FilePath;
        var storageKey = 'resources/' + dateFolder + '/' + filename;
        await this._storageService.upload(storageKey, filepath);
        return storageKey;
    }

    private async cleanupDirectories(parentFolder) {

        try {
            const getDirectories = source =>
                fs.readdirSync(source, { withFileTypes: true })
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);
    
            var cleanupBefore = this._timeService.subtractDuration(new Date(), CLEANUP_DURATION, DurationType.Minutes);
            var directories = getDirectories(parentFolder);
    
            for await (var d of directories) {
                var tmp = new Date();
                tmp.setTime(parseInt(d));
                var createdAt = tmp;
                var isBefore = this._timeService.isBefore(createdAt, cleanupBefore);
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

    //#endregion

}
