import FileResource from '../models/file.resource/file.resource.model';
import { FileResourceDetailsDto } from '../../../../domain.types/file.resource/file.resource.dto';
import FileResourceReference from '../models/file.resource/file.resource.reference.model';
import FileResourceVersion from '../models/file.resource/file.resource.version.model';
import { ResourceReference } from '../../../../domain.types/file.resource/file.resource.types';
import { FileResourceMetadata } from '../../../../domain.types/file.resource/file.resource.types';

///////////////////////////////////////////////////////////////////////////////////

export class FileResourceMapper {

    static toDto = (fileResource: FileResource): FileResourceDetailsDto => {

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
            LatestVersion    : null
        };
        return dto;
    }

    static toFileReferenceDtos = (references ?:FileResourceReference[]): ResourceReference[] => {
        var dtos = references.map(x => {
            var ref: ResourceReference = {
                ItemId   : x.ReferenceItemId,
                ItemType : x.ReferenceType
            };
            return ref;
        });
        return dtos;
    }

    static toFileVersionDtos = (fileVersions ?: FileResourceVersion[]): FileResourceMetadata[] => {

        var dtos = fileVersions.map(x => {

            var v: FileResourceMetadata = {
                VersionIdentifier : x.Version,
                FileName          : x.FileName,
                MimeType          : x.MimeType,
                OriginalName      : x.OriginalFileName,
                Size              : x.SizeInKB,
                StorageKey        : x.StorageKey,
                SourceFilePath    : null
            };

            return v;
        });
        
        return dtos;
    }

}
