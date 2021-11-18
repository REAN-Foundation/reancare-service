
import { inject, injectable } from "tsyringe";
import { Helper } from "../../common/helper";
import { IDocumentRepo } from "../../database/repository.interfaces/patient/document.repo.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { DocumentDomainModel } from '../../domain.types/patient/document/document.domain.model';
import { DocumentDto } from '../../domain.types/patient/document/document.dto';
import { DocumentSearchFilters, DocumentSearchResults } from "../../domain.types/patient/document/document.search.types";
import { DocumentTypes } from "../../domain.types/patient/document/document.types";
import { SharedDocumentDetailsDomainModel } from "../../domain.types/patient/document/shared.document.details.domain.model";
import { SharedDocumentDetailsDto } from "../../domain.types/patient/document/shared.document.details.dto";
import { BaseResourceService } from "../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DocumentService extends BaseResourceService {

    constructor(
        @inject('IDocumentRepo') private _documentRepo: IDocumentRepo,
    ) {
        super();
    }

    getById = async (id: uuid): Promise<DocumentDto> => {
        return await this._documentRepo.getById(id);
    };

    update = async (id: uuid, documentDomainModel: DocumentDomainModel):
    Promise<DocumentDto> => {
        return await this._documentRepo.update(id, documentDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._documentRepo.delete(id);
    };

    upload = async (model: DocumentDomainModel):
    Promise<DocumentDto> => {
        model.DisplayId = this.getDocumentDisplayId(model.DocumentType);
        return await this._documentRepo.upload(model);
    }

    search = async (filters: DocumentSearchFilters): Promise<DocumentSearchResults> => {
        return await this._documentRepo.search(filters);
    }

    rename = async (id: uuid, newName: string): Promise<DocumentDto> => {
        return await this._documentRepo.rename(id, newName);
    }

    share = async (model: SharedDocumentDetailsDomainModel): Promise<SharedDocumentDetailsDto> => {
        return await this._documentRepo.share(model);
    }

    getSharedDocument = async (key: string): Promise<SharedDocumentDetailsDto> => {
        return await this._documentRepo.getSharedDocument(key);
    }

    sharedKeyExists = async (key: string): Promise<boolean> => {
        return await this._documentRepo.sharedKeyExists(key);
    }

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
    }

    //#endregion

}
