import FileResource from '../../models/general/file.resource/file.resource.model';
import { FileResourceDetailsDto, FileResourceDto } from '../../../../../domain.types/general/file.resource/file.resource.dto';
import FileResourceReference from '../../models/general/file.resource/file.resource.reference.model';
import FileResourceVersion from '../../models/general/file.resource/file.resource.version.model';
import { ResourceReference } from '../../../../../domain.types/general/file.resource/file.resource.types';
import { FileResourceMetadata } from '../../../../../domain.types/general/file.resource/file.resource.types';
import { ConfigurationManager } from '../../../../../config/configuration.manager';

///////////////////////////////////////////////////////////////////////////////////

export class FileResourceMapper {

    static toDetailsDto = (fileResource: FileResource): FileResourceDetailsDto => {

        if (fileResource == null){
            return null;
        }

        var url = ConfigurationManager.BaseUrl() + '/api/v1/file-resources/' + fileResource.id + '/download';

        const dto: FileResourceDetailsDto = {
            id               : fileResource.id,
            FileName         : fileResource.FileName,
            Url              : url,
            OwnerUserId      : fileResource.OwnerUserId,
            UploadedByUserId : fileResource.UploadedByUserId,
            IsPublicResource : fileResource.IsPublicResource,
            MimeType         : fileResource.MimeType,
            References       : [],
            Tags             : fileResource.Tags ? JSON.parse(fileResource.Tags) : [],
            Versions         : [],
            DefaultVersion   : fileResource.DefaultVersion ?
                FileResourceMapper.toFileVersionDto(fileResource.DefaultVersion) : null
        };
        return dto;
    };

    static toDto = (fileResource: FileResource): FileResourceDto => {

        if (fileResource == null){
            return null;
        }

        const dto: FileResourceDto = {
            id               : fileResource.id,
            FileName         : fileResource.FileName,
            OwnerUserId      : fileResource.OwnerUserId,
            IsPublicResource : fileResource.IsPublicResource,
            MimeType         : fileResource.MimeType,
            DefaultVersion   : fileResource.DefaultVersion ?
                FileResourceMapper.toFileVersionDto(fileResource.DefaultVersion) : null
        };

        return dto;
    };

    static toFileReferenceDtos = (references ?:FileResourceReference[]): ResourceReference[] => {
        var dtos = references.map(x => {

            if (x == null){
                return null;
            }

            var ref: ResourceReference = {
                ItemId   : x.ReferenceId,
                ItemType : x.Type,
                Keyword  : x.Keyword
            };
            return ref;
        });
        return dtos;
    };

    static toFileVersionDtos = (fileVersions ?: FileResourceVersion[], sanitize = false): FileResourceMetadata[] => {

        var dtos = fileVersions.map(x => {
            return FileResourceMapper.toFileVersionDto(x, sanitize);
        });

        return dtos;
    };

    static toFileVersionDto = (fileVersion ?: FileResourceVersion, sanitize = false): FileResourceMetadata => {

        if (fileVersion == null){
            return null;
        }

        var url = ConfigurationManager.BaseUrl() + '/api/v1/file-resources/' + fileVersion.ResourceId + '/download-by-version-name/' + fileVersion.Version;

        var v: FileResourceMetadata = {
            VersionId    : fileVersion.id,
            ResourceId   : fileVersion.ResourceId,
            Version      : fileVersion.Version,
            FileName     : fileVersion.FileName,
            MimeType     : fileVersion.MimeType,
            OriginalName : fileVersion.OriginalFileName,
            Size         : fileVersion.SizeInKB,
            StorageKey   : fileVersion.StorageKey,
            Url          : url
        };

        if (sanitize) {
            v.StorageKey = null;
        }

        return v;
    };

}
