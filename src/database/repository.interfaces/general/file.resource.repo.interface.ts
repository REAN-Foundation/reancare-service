import { FileResourceMetadata } from "../../../domain.types/general/file.resource/file.resource.types";
import { FileResourceUpdateModel, FileResourceUploadDomainModel } from "../../../domain.types/general/file.resource/file.resource.domain.model";
import { FileResourceDetailsDto, FileResourceDto } from "../../../domain.types/general/file.resource/file.resource.dto";
import { FileResourceSearchFilters, FileResourceSearchResults } from "../../../domain.types/general/file.resource/file.resource.search.types";

///////////////////////////////////////////////////////////////////////////////////////

export interface IFileResourceRepo {

    create(domainModel: FileResourceUploadDomainModel): Promise<FileResourceDetailsDto>;

    getById(id: string): Promise<FileResourceDetailsDto>;

    update(id: string, model: FileResourceUpdateModel): Promise<FileResourceDetailsDto>;

    addVersion(metadata: FileResourceMetadata, makeDefaultVersion: boolean): Promise<FileResourceMetadata>;

    searchForDownload(filters: FileResourceSearchFilters): Promise<FileResourceDto[]>;

    getVersionByVersionName(id: string, versionName: string): Promise<FileResourceMetadata>;

    getVersionByVersionId(id: string, versionId: string): Promise<FileResourceMetadata>;

    getLatestVersion(id: string): Promise<FileResourceMetadata>;

    getVersions(id: string): Promise<FileResourceMetadata[]>;

    getVersionNames(id: string): Promise<string[]>;

    search(filters: FileResourceSearchFilters): Promise<FileResourceSearchResults>;

    rename(id: string, newFileName: string): Promise<boolean>;

    delete(id: string): Promise<boolean>;

    deleteVersionByVersionId(ResourceId: any, Version: any): Promise<boolean>;

}
