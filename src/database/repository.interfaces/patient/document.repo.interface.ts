import { DocumentDomainModel } from "../../../domain.types/patient/document/document.domain.model";
import { DocumentDto } from "../../../domain.types/patient/document/document.dto";

export interface IDocumentRepo {

    create(documentDomainModel: DocumentDomainModel): Promise<DocumentDto>;

    getById(id: string): Promise<DocumentDto>;
    
    update(id: string, documentDomainModel: DocumentDomainModel):
    Promise<DocumentDto>;

    delete(id: string): Promise<boolean>;

}
