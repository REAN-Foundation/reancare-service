import { inject, injectable } from "tsyringe";
import { IDocumentRepo } from "../../database/repository.interfaces/patient/document.repo.interface";
import { DocumentDomainModel } from '../../domain.types/patient/document/document.domain.model';
import { DocumentDto } from '../../domain.types/patient/document/document.dto';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DocumentService {

    constructor(
        @inject('IDocumentRepo') private _documentRepo: IDocumentRepo,
    ) { }

    create = async (documentDomainModel: DocumentDomainModel):
    Promise<DocumentDto> => {
        return await this._documentRepo.create(documentDomainModel);
    };

    getById = async (id: string): Promise<DocumentDto> => {
        return await this._documentRepo.getById(id);
    };

    update = async (id: string, documentDomainModel: DocumentDomainModel):
    Promise<DocumentDto> => {
        return await this._documentRepo.update(id, documentDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._documentRepo.delete(id);
    };

}

