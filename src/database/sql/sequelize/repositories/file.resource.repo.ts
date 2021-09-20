import { Op } from 'sequelize';
import { FileResourceMapper } from '../mappers/file.resource.mapper';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';
import {
    FileResourceMetadata,
    FileResourceRenameDomainModel,
    FileResourceSearchDownloadDomainModel,
    FileResourceUploadDomainModel,
    FileResourceVersionDomainModel,
} from '../../../../domain.types/file.resource/file.resource.domain.model';

import {
    DownloadedFilesDetailsDto,
    FileResourceDto,
    FileVersionDetailsDto,
} from '../../../../domain.types/file.resource/file.resource.dto';

import {
    FileResourceSearchFilters,
    FileResourceSearchResults,
} from '../../../../domain.types/file.resource/file.resource.search.types';

import { IFileResourceRepo } from '../../../../database/repository.interfaces/file.resource.repo.interface';

///////////////////////////////////////////////////////////////////////

export class FileResourceRepo implements IFileResourceRepo {

    create = async (domainModel: FileResourceUploadDomainModel): Promise<FileResourceDto> => {
        throw new Error('Method not implemented.');
    };

    getById = async (id: string): Promise<FileResourceDto> => {
        throw new Error('Method not implemented.');
    }

    addVersionDetails = async (versionModel: FileResourceVersionDomainModel): Promise<FileVersionDetailsDto> => {
        throw new Error('Method not implemented.');
    }

    searchForDownload = async (filters: FileResourceSearchDownloadDomainModel): Promise<DownloadedFilesDetailsDto> => {
        throw new Error('Method not implemented.');
    }

    getVersionDetails = async (versionModel: FileResourceVersionDomainModel): Promise<FileVersionDetailsDto> => {
        throw new Error('Method not implemented.');
    }

    search = async (filters: FileResourceSearchFilters): Promise<FileResourceSearchResults> => {
        throw new Error('Method not implemented.');
    }

    rename = async (id: string, newFileName: string): Promise<boolean> => {
        throw new Error('Method not implemented.');
    }

    delete = async (id: string): Promise<boolean> => {
        throw new Error('Method not implemented.');
    }

    deleteVersion = async (ResourceId: any, Version: any) => {
        throw new Error('Method not implemented.');
    }

    getVersions = async (id: string) => {
        throw new Error('Method not implemented.');
    }

}
