
import { inject, injectable } from "tsyringe";
import { Helper } from "../../../common/helper";
import { IDocumentRepo } from "../../../database/repository.interfaces/users/patient/document.repo.interface";
import { DocumentDomainModel } from '../../../domain.types/users/patient/document/document.domain.model';
import { DocumentDto } from '../../../domain.types/users/patient/document/document.dto';
import { DocumentSearchFilters, DocumentSearchResults } from "../../../domain.types/users/patient/document/document.search.types";
import { DocumentTypes } from "../../../domain.types/users/patient/document/document.types";
import { SharedDocumentDetailsDomainModel } from "../../../domain.types/users/patient/document/shared.document.details.domain.model";
import { SharedDocumentDetailsDto } from "../../../domain.types/users/patient/document/shared.document.details.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DocumentService {

    constructor(
        @inject('IDocumentRepo') private _documentRepo: IDocumentRepo,
    ) { }

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

    upload = async (model: DocumentDomainModel):
    Promise<DocumentDto> => {
        model.DisplayId = this.getDocumentDisplayId(model.DocumentType);
        return await this._documentRepo.upload(model);
    };

    search = async (filters: DocumentSearchFilters): Promise<DocumentSearchResults> => {
        return await this._documentRepo.search(filters);
    };

    rename = async (id: string, newName: string): Promise<DocumentDto> => {
        return await this._documentRepo.rename(id, newName);
    };

    share = async (model: SharedDocumentDetailsDomainModel): Promise<SharedDocumentDetailsDto> => {
        return await this._documentRepo.share(model);
    };

    getSharedDocument = async (key: string): Promise<SharedDocumentDetailsDto> => {
        return await this._documentRepo.getSharedDocument(key);
    };

    sharedKeyExists = async (key: string): Promise<boolean> => {
        return await this._documentRepo.sharedKeyExists(key);
    };

    //#region Privates

    getDocumentDisplayId = (docType: DocumentTypes) => {

        var prefix = 'DCMT';

        var prefixes = {};
        prefixes[DocumentTypes.LabReport] = 'LBRP';
        prefixes[DocumentTypes.ImagingStudy] = 'IMST';
        prefixes[DocumentTypes.DrugPrescription] = 'MDPR';
        prefixes[DocumentTypes.DiagnosticPrescription] = 'DGPR';
        prefixes[DocumentTypes.DoctorNotes] = 'DRNT';
        prefixes[DocumentTypes.DischargeSummary] = 'DSSM';
        prefixes[DocumentTypes.OpdPaper] = 'OPDP';
        prefixes[DocumentTypes.Unknown] = 'UNKN';

        const keys = Object.keys(prefixes);

        if (keys.includes(docType)){
            prefix = prefixes[docType];
        }

        return Helper.generateDisplayId(prefix);
    };

    //#endregion

}
