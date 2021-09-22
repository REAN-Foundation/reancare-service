import { Op } from 'sequelize';
import { FileResourceMapper } from '../mappers/file.resource.mapper';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';
import {
    FileResourceMetadata,
    FileResourceRenameDomainModel,
    FileResourceSearchDownloadDomainModel,
    FileResourceUploadDomainModel,
} from '../../../../domain.types/file.resource/file.resource.domain.model';

import {
    FileResourceDetailsDto,
    FileVersionDetailsDto,
} from '../../../../domain.types/file.resource/file.resource.dto';

import {
    FileResourceSearchFilters,
    FileResourceSearchResults,
} from '../../../../domain.types/file.resource/file.resource.search.types';

import { IFileResourceRepo } from '../../../../database/repository.interfaces/file.resource.repo.interface';
import FileResource from '../models/file.resource/file.resource.model';
import FileResourceReference from '../models/file.resource/file.resource.reference.model';
import { ResourceReference } from '../../../../domain.types/file.resource/file.resource.types';

///////////////////////////////////////////////////////////////////////

export class FileResourceRepo implements IFileResourceRepo {

    create = async (domainModel: FileResourceUploadDomainModel): Promise<FileResourceDetailsDto> => {
        try {

            var tags = domainModel.Tags && domainModel.Tags.length  > 0 ? JSON.stringify(domainModel.Tags) : null;

            const entity = {
                FileName               : domainModel.FileMetadata.FileName,
                OwnerUserId            : domainModel.OwnerUserId ?? null,
                UploadedByUserId       : domainModel.UploadedByUserId ?? null,
                IsPublic               : domainModel.IsPublicResource ?? false,
                IsMultiResolutionImage : domainModel.IsMultiResolutionImage ?? false,
                Tags                   : tags,
                MimeType               : domainModel.MimeType ?? null,
                UploadedDate           : new Date(),
            };
            const resource = await FileResource.create(entity);
            if (resource === null) {
                throw new Error('Error creating file resource');
            }

            var references: FileResourceReference[] = [];
            var addReferences = domainModel.References && domainModel.References.length > 0;
            if (addReferences) {
                for await (var reference of domainModel.References) {
                    const ref = await FileResourceReference.create({
                        ResourceId      : resource.id,
                        ReferenceItemId : reference.ItemId,
                        ReferenceType   : reference.ItemType
                    });
                    references.push(ref);
                }
            }
        
            var dto = FileResourceMapper.toDto(resource);
            dto.References = FileResourceMapper.toFileReferenceDtos(references);
            
            return dto;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<FileResourceDetailsDto> => {

        const resource = await FileResource.findByPk(id);
        if (resource === null) {
            throw new Error('Cannot find the resource!');
        }
        var dto = FileResourceMapper.toDto(resource);

        const references = await FileResourceReference.findAll({
            where
        });

        return dto;
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
