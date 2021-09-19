import { inject, injectable } from "tsyringe";
import {
    FileResourceSearchDownloadDomainModel,
    FileResourceUploadDomainModel,
    FileResourceVersionDomainModel
} from '../domain.types/file.resource/file.resource.domain.model';

import { DownloadedFilesDetailsDto, FileResourceDto } from '../domain.types/file.resource/file.resource.dto';
import { FileResourceSearchResults, FileResourceSearchFilters } from '../domain.types/file.resource/file.resource.search.types';
import { IFileResourceRepo } from "../database/repository.interfaces/file.resource.repo.interface";
import { IFileStorageService } from '../modules/storage/interfaces/file.storage.service.interface';
import { ITimeService } from "../modules/time/interfaces/time.service.interface";

import { Logger } from "../common/logger";
import fs from 'fs';
import mime from 'mime';
import * as admzip from 'adm-zip';
import path from 'path';
import * as _ from 'lodash';

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

    upload = async (domainModel: FileResourceUploadDomainModel): Promise<FileResourceDto> => {
        
        var uploaded = [];
        var timestamp = this._timeService.timestamp(new Date());
        var folderPath = path.join(TEMP_UPLOAD_FOLDER, timestamp);
        var fileDetails = StoreLocally(folderPath, files);
        if (fileDetails.length > 0) {
            uploaded = await this.UploadToS3(userId, fileDetails, isPublicResource, referencingItemId, referencingItemKeyword, storeByReference);
            for await (var d of fileDetails) {
                //fs.unlinkSync(d.path); //Remove from temp folder
            }
            return uploaded;
        }
        return await this._fileResourceRepo.create(domainModel);
    };

    uploadVersion = async (domainModel: FileResourceVersionDomainModel): Promise<FileResourceDto> => {
        
        return await this._fileResourceRepo.create(domainModel);
    };

    searchAndDownload = async (domainModel: FileResourceSearchDownloadDomainModel)
        : Promise<DownloadedFilesDetailsDto> => {
        return await this._fileResourceRepo.create(domainModel);
    };

    downloadByVersion = async (domainModel: FileResourceVersionDomainModel): Promise<FileResourceDto> => {
        return await this._fileResourceRepo.getById(domainModel);
    };

    downloadById = async (id: string): Promise<FileResourceDto> => {
        return await this._fileResourceRepo.getById(id);
    };

    search = async (filters: FileResourceSearchFilters): Promise<FileResourceSearchResults> => {
        return await this._fileResourceRepo.search(filters);
    };

    getById = async (id: string): Promise<FileResourceDto> => {
        return await this._fileResourceRepo.getById(id);
    };

    deleteByReference = async (id: string): Promise<FileResourceDto> => {
        return await this._fileResourceRepo.delete(id);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._fileResourceRepo.delete(id);
    };

}
