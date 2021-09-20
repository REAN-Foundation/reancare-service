import { FileResourceSearchDownloadDomainModel, FileResourceUploadDomainModel, FileResourceVersionDomainModel } from "../../domain.types/file.resource/file.resource.domain.model";
import { DownloadedFilesDetailsDto, FileResourceDto, FileVersionDetailsDto } from "../../domain.types/file.resource/file.resource.dto";
import { FileResourceSearchFilters, FileResourceSearchResults } from "../../domain.types/file.resource/file.resource.search.types";

///////////////////////////////////////////////////////////////////////////////////////

export interface IFileResourceRepo {

    create(domainModel: FileResourceUploadDomainModel): Promise<FileResourceDto>;

    getById(id: string): Promise<FileResourceDto>;

    addVersionDetails(versionModel: FileResourceVersionDomainModel): Promise<FileVersionDetailsDto>;

    searchForDownload(filters: FileResourceSearchDownloadDomainModel): Promise<DownloadedFilesDetailsDto>;

    getVersionDetails(versionModel: FileResourceVersionDomainModel): Promise<FileVersionDetailsDto>;

    search(filters: FileResourceSearchFilters): Promise<FileResourceSearchResults>;

    rename(id: string, newFileName: string): Promise<boolean>;

    delete(id: string): Promise<boolean>;

    deleteVersion(ResourceId: any, Version: any);
    
    getVersions(id: string);

}
