import { FileResourceMetadata } from "../../domain.types/file.resource/file.resource.types";
import { FileResourceUploadDomainModel } from "../../domain.types/file.resource/file.resource.domain.model";
import { FileResourceDetailsDto, FileResourceDto } from "../../domain.types/file.resource/file.resource.dto";
import { FileResourceSearchFilters, FileResourceSearchResults } from "../../domain.types/file.resource/file.resource.search.types";

///////////////////////////////////////////////////////////////////////////////////////

export interface IFileResourceRepo {

    create(domainModel: FileResourceUploadDomainModel): Promise<FileResourceDetailsDto>;

    getById(id: string): Promise<FileResourceDetailsDto>;

    addVersion(metadata: FileResourceMetadata, makeDefaultVersion: boolean): Promise<FileResourceMetadata>;

    searchForDownload(filters: FileResourceSearchFilters): Promise<FileResourceDto[]>;

    getVersion(id: string, version: string): Promise<FileResourceMetadata>;
    
    getVersions(id: string): Promise<FileResourceMetadata[]>;

    getVersionNames(id: string): Promise<string[]>;
    
    search(filters: FileResourceSearchFilters): Promise<FileResourceSearchResults>;

    rename(id: string, newFileName: string): Promise<boolean>;

    delete(id: string): Promise<boolean>;

    deleteVersion(ResourceId: any, Version: any): Promise<boolean>;

}
