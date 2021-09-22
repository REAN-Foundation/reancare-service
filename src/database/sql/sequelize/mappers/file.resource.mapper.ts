import FileResource from '../models/file.resource/file.resource.model';
import { FileResourceDetailsDto, FileResourceDto } from '../../../../domain.types/file.resource/file.resource.dto';
import FileResourceReference from '../models/file.resource/file.resource.reference.model';
import FileResourceVersion from '../models/file.resource/file.resource.version.model';
import { ResourceReference } from '../../../../domain.types/file.resource/file.resource.types';
import { FileResourceMetadata } from '../../../../domain.types/file.resource/file.resource.types';

///////////////////////////////////////////////////////////////////////////////////

export class FileResourceMapper {

    static toDetailsDto = (
        fileResource: FileResource,
        defaultVersion?: FileResourceVersion): FileResourceDetailsDto => {

        if (fileResource == null){
            return null;
        }

        const dto: FileResourceDetailsDto = {
            id               : fileResource.id,
            FileName         : fileResource.FileName,
            OwnerUserId      : fileResource.OwnerUserId,
            UploadedByUserId : fileResource.UploadedByUserId,
            IsPublicResource : fileResource.IsPublicResource,
            MimeType         : fileResource.MimeType,
            References       : [],
            Tags             : fileResource.Tags ? JSON.parse(fileResource.Tags) : [],
            Versions         : [],
            DefaultVersion   : defaultVersion ? FileResourceMapper.toFileVersionDto(defaultVersion) : null
        };
        return dto;
    }

    static toDto = (fileResource: FileResource, defaultVersion?: FileResourceVersion): FileResourceDto => {

        if (fileResource == null){
            return null;
        }

        const dto: FileResourceDto = {
            id               : fileResource.id,
            FileName         : fileResource.FileName,
            OwnerUserId      : fileResource.OwnerUserId,
            IsPublicResource : fileResource.IsPublicResource,
            MimeType         : fileResource.MimeType,
            DefaultVersion   : defaultVersion ? FileResourceMapper.toFileVersionDto(defaultVersion) : null
        };

        return dto;
    }

    static toFileReferenceDtos = (references ?:FileResourceReference[]): ResourceReference[] => {
        var dtos = references.map(x => {
            var ref: ResourceReference = {
                ItemId   : x.ReferenceItemId,
                ItemType : x.ReferenceType,
                Keyword  : x.Keyword
            };
            return ref;
        });
        return dtos;
    }

    static toFileVersionDtos = (fileVersions ?: FileResourceVersion[]): FileResourceMetadata[] => {

        var dtos = fileVersions.map(x => {
            return FileResourceMapper.toFileVersionDto(x);
        });
        
        return dtos;
    }

    static toFileVersionDto = (fileVersion ?: FileResourceVersion): FileResourceMetadata => {

        var v: FileResourceMetadata = {
            VersionIdentifier : fileVersion.Version,
            FileName          : fileVersion.FileName,
            MimeType          : fileVersion.MimeType,
            OriginalName      : fileVersion.OriginalFileName,
            Size              : fileVersion.SizeInKB,
            StorageKey        : fileVersion.StorageKey,
        };

        return v;
    }

}
