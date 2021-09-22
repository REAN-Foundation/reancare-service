import { Op } from 'sequelize';
import { FileResourceMapper } from '../mappers/file.resource.mapper';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';
import { FileResourceUploadDomainModel } from '../../../../domain.types/file.resource/file.resource.domain.model';
import { FileResourceDetailsDto, FileResourceDto } from '../../../../domain.types/file.resource/file.resource.dto';
import { FileResourceSearchFilters, FileResourceSearchResults } from '../../../../domain.types/file.resource/file.resource.search.types';
import { IFileResourceRepo } from '../../../../database/repository.interfaces/file.resource.repo.interface';
import FileResource from '../models/file.resource/file.resource.model';
import FileResourceReference from '../models/file.resource/file.resource.reference.model';
import { FileResourceMetadata, ResourceReference } from '../../../../domain.types/file.resource/file.resource.types';
import FileResourceVersion from '../models/file.resource/file.resource.version.model';

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
                DefaultVersionId       : domainModel.DefaultVersionId
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
        
            var dto = FileResourceMapper.toDetailsDto(resource);
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
        var dto = FileResourceMapper.toDetailsDto(resource);

        const references = await FileResourceReference.findAll({
            where : {
                ResourceId : id
            }
        });
        dto.References = FileResourceMapper.toFileReferenceDtos(references);

        if (resource.DefaultVersionId) {
            var defaultVersion = await FileResourceVersion.findByPk(resource.DefaultVersionId);
            dto.DefaultVersion = FileResourceMapper.toFileVersionDto(defaultVersion);
        }

        var versions = await FileResourceVersion.findAll({
            where : {
                ResourceId : id
            },
            order : [['UpdatedAt', 'DESC']]
        });
        dto.Versions = FileResourceMapper.toFileVersionDtos(versions);
        
        return dto;
    }

    addVersion = async (metadata: FileResourceMetadata, makeDefaultVersion: boolean): Promise<FileResourceMetadata> => {
        
        var fileVersion = {
            ResourceId       : metadata.ResourceId,
            Version          : metadata.VersionIdentifier,
            FileName         : metadata.FileName,
            OriginalFileName : metadata.OriginalName,
            MimeType         : metadata.MimeType,
            StorageKey       : metadata.StorageKey,
            SizeInKB         : metadata.Size,
        };

        var version = await FileResourceVersion.create(fileVersion);
        if (version === null) {
            throw new Error('Unable to create version instance in database!');
        }

        if (makeDefaultVersion) {
            var resource = await FileResource.findByPk(metadata.ResourceId);
            if (resource === null) {
                throw new Error('Unable to find resource!');
            }
            resource.DefaultVersionId = version.id;
            await resource.save();
        }

        return FileResourceMapper.toFileVersionDto(version);
    }

    searchForDownload = async (filters: FileResourceSearchFilters): Promise<FileResourceDto[]> => {
        throw new Error('Method not implemented.');
    }

    getVersion = async (id: string, version: string): Promise<FileResourceMetadata> => {
        throw new Error('Method not implemented.');
    }

    getVersionNames = async (id: string): Promise<string[]> => {
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
