import { FileResourceMetadata } from "../../domain.types/file.resource/file.resource.types";
import { FileResourceSearchDownloadDomainModel, FileResourceUploadDomainModel, FileResourceVersionDomainModel } from "../../domain.types/file.resource/file.resource.domain.model";
import { FileResourceDetailsDto, FileResourceDto, FileVersionDetailsDto } from "../../domain.types/file.resource/file.resource.dto";
import { FileResourceSearchFilters, FileResourceSearchResults } from "../../domain.types/file.resource/file.resource.search.types";

///////////////////////////////////////////////////////////////////////////////////////

export interface IFileResourceRepo {

    create(domainModel: FileResourceUploadDomainModel): Promise<FileResourceDetailsDto>;

    getById(id: string): Promise<FileResourceDetailsDto>;

    addVersionDetails(id: string, metadata: FileResourceMetadata): Promise<FileResourceMetadata>;

    searchForDownload(filters: FileResourceSearchDownloadDomainModel): Promise<FileResourceDto[]>;

    getVersionDetails(versionModel: FileResourceVersionDomainModel): Promise<FileVersionDetailsDto>;

    search(filters: FileResourceSearchFilters): Promise<FileResourceSearchResults>;

    rename(id: string, newFileName: string): Promise<boolean>;

    delete(id: string): Promise<boolean>;

    deleteVersion(ResourceId: any, Version: any);
    
    getVersions(id: string);

}
