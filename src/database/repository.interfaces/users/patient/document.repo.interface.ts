import { DocumentDomainModel } from "../../../../domain.types/users/patient/document/document.domain.model";
import { DocumentDto } from "../../../../domain.types/users/patient/document/document.dto";
import { DocumentSearchFilters, DocumentSearchResults } from "../../../../domain.types/users/patient/document/document.search.types";
import { SharedDocumentDetailsDomainModel } from "../../../../domain.types/users/patient/document/shared.document.details.domain.model";
import { SharedDocumentDetailsDto } from "../../../../domain.types/users/patient/document/shared.document.details.dto";

export interface IDocumentRepo {

    sharedKeyExists(key: string): PromiseLike<boolean>;

    getSharedDocument(key: string): Promise<SharedDocumentDetailsDto>;

    share(model: SharedDocumentDetailsDomainModel): Promise<SharedDocumentDetailsDto>;

    rename(id: string, newName: string): DocumentDto | PromiseLike<DocumentDto>;

    search(filters: DocumentSearchFilters): Promise<DocumentSearchResults>;

    upload(documentDomainModel: DocumentDomainModel): Promise<DocumentDto>;

    getById(id: string): Promise<DocumentDto>;

    update(id: string, documentDomainModel: DocumentDomainModel): Promise<DocumentDto>;

    delete(id: string): Promise<boolean>;

}
