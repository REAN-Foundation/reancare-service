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
import { FileResourceMetadata } from '../../../../domain.types/file.resource/file.resource.types';
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
            Version          : metadata.Version,
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
        try {

            var search = this.constructResourceModelSearchObject(filters);
            const foundResults = await FileResource.findAndCountAll(search);

            const dtos: FileResourceDto[] = [];
            for (const resource of foundResults.rows) {
                const dto = await FileResourceMapper.toDto(resource);
                dtos.push(dto);
            }

            return dtos;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    getVersionByVersionName = async (id: string, versionName: string): Promise<FileResourceMetadata> => {

        var fileResourceVersion = await FileResourceVersion.findOne({
            where : {
                ResourceId : id,
                Version    : { [Op.like]: '%' + versionName + '%' }
            }
        });

        return FileResourceMapper.toFileVersionDto(fileResourceVersion);

    }

    getVersionByVersionId = async (id: string, versionId: string): Promise<FileResourceMetadata> => {

        var fileResourceVersion = await FileResourceVersion.findOne({
            where : {
                ResourceId : id,
                id         : versionId
            }
        });

        return FileResourceMapper.toFileVersionDto(fileResourceVersion);

    }

    getLatestVersion = async (id: string): Promise<FileResourceMetadata> => {

        var fileResourceVersion = await FileResourceVersion.findOne({
            where : {
                ResourceId : id
            },
            order : [ [ 'CreatedAt', 'DESC' ]]
        });

        return FileResourceMapper.toFileVersionDto(fileResourceVersion);

    }

    getVersions = async (id: string) => {

        var fileResourceVersions = await FileResourceVersion.findAll({
            where : {
                ResourceId : id
            }
        });

        return FileResourceMapper.toFileVersionDtos(fileResourceVersions);
    }

    getVersionNames = async (id: string): Promise<string[]> => {

        var versions = await FileResourceVersion.findAll({
            where : {
                ResourceId : id
            }
        });

        return versions.map(x => x.Version);
    }

    search = async (filters: FileResourceSearchFilters): Promise<FileResourceSearchResults> => {
        try {
            const search = this.constructResourceModelSearchObject(filters);

            let orderByColum = 'Createdat';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await FileResource.findAndCountAll(search);

            const dtos: FileResourceDto[] = [];
            for (const resource of foundResults.rows) {
                const dto = await FileResourceMapper.toDto(resource);
                dtos.push(dto);
            }

            const searchResults: FileResourceSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };

            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    rename = async (id: string, newFileName: string): Promise<boolean> => {

        var resource = await FileResource.findByPk(id);
        if (resource === null) {
            throw new Error('Cannot find the resource!');
        }

        resource.FileName = newFileName;
        await resource.save();

        return true;
    }

    delete = async (id: string): Promise<boolean> => {

        var result = await FileResourceVersion.destroy({
            where : {
                ResourceId : id
            }
        });

        result = await FileResourceReference.destroy({
            where : {
                ResourceId : id
            }
        });

        result = await FileResource.destroy({
            where : {
                id : id
            }
        });

        return result > 0;
    }

    deleteVersionByVersionId = async (id: any, versionId: any): Promise<boolean> => {
        
        var result = await FileResourceVersion.destroy({
            where : {
                ResourceId : id,
                id         : versionId
            }
        });
        return result > 1;
    }

    //#region Privates

    private constructResourceModelSearchObject(filters: FileResourceSearchFilters) {

        const search = { where: {} };

        if (filters.OwnerUserId != null) {
            search.where['OwnerUserId'] = { [Op.like]: '%' + filters.OwnerUserId + '%' };
        }
        if (filters.UploadedByUserId != null) {
            search.where['UploadedByUserId'] = { [Op.like]: '%' + filters.UploadedByUserId + '%' };
        }
        if (filters.IsPublicResource != null) {
            search.where['IsPublicResource'] = filters.IsPublicResource;
        }
        if (filters.Tag != null) {
            search.where['Tags'] = { [Op.like]: '%' + filters.Tag + '%' };
        }
        if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
            search.where['CreatedAt'] = {
                [Op.gte] : filters.CreatedDateFrom,
                [Op.lte] : filters.CreatedDateTo,
            };
        } else if (filters.CreatedDateFrom === null && filters.CreatedDateTo !== null) {
            search.where['CreatedAt'] = {
                [Op.lte] : filters.CreatedDateTo,
            };
        } else if (filters.CreatedDateFrom !== null && filters.CreatedDateTo === null) {
            search.where['CreatedAt'] = {
                [Op.gte] : filters.CreatedDateFrom,
            };
        }

        var referenceFilter = {
            model : FileResourceReference,
            where : {
            }
        };
        if (filters.ReferenceId != null) {
            referenceFilter.where['ReferenceId'] = { [Op.like]: '%' + filters.ReferenceId + '%' };
        }
        if (filters.ReferenceType != null) {
            referenceFilter.where['Type'] = { [Op.like]: '%' + filters.ReferenceType + '%' };
        }
        if (filters.ReferenceKeyword != null) {
            referenceFilter.where['Keyword'] = { [Op.like]: '%' + filters.ReferenceKeyword + '%' };
        }

        search['include'] = [
            referenceFilter,
            {
                model : FileResourceVersion,
                as    : 'DefaultVersion'
            }
        ];

        return search;
    }

    //#endregion

}
