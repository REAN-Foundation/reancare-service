import { inject, injectable } from 'tsyringe';
import { IDiagnosisRepo } from '../../database/repository.interfaces/clinical/diagnosis.repo.interface';
import { IPatientRepo } from '../../database/repository.interfaces/patient/patient.repo.interface';
import { IPersonRepo } from '../../database/repository.interfaces/person.repo.interface';
import { IPersonRoleRepo } from '../../database/repository.interfaces/person.role.repo.interface';
import { IUserRepo } from '../../database/repository.interfaces/user/user.repo.interface';
import { DiagnosisDomainModel } from '../../domain.types/clinical/diagnosis/diagnosis.domain.model';
import { DiagnosisDto } from '../../domain.types/clinical/diagnosis/diagnosis.dto';
import { DiagnosisSearchFilters, DiagnosisSearchResults } from '../../domain.types/clinical/diagnosis/diagnosis.search.types';
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { BaseResourceService } from "../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DiagnosisService  extends BaseResourceService {

    //_ehrDiagnosisStore: DiagnosisStore = null;

    constructor(
        @inject('IDiagnosisRepo') private _diagnosisRepo: IDiagnosisRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
    ) {
        super();
        //this._ehrDiagnosisStore = Loader.container.resolve(DiagnosisStore);
    }

    //#region Publics

    create = async (diagnosisDomainModel: DiagnosisDomainModel): Promise<DiagnosisDto> => {
        
        //const ehrId = await this._ehrDiagnosisStore.create(diagnosisDomainModel);
        //diagnosisDomainModel.EhrId = ehrId;

        var dto = await this._diagnosisRepo.create(diagnosisDomainModel);
        dto = await this.updateDto(dto);

        return dto;
    };

    public getByUserId = async (id: uuid): Promise<DiagnosisDto> => {
        var dto = await this._diagnosisRepo.getById(id);
        dto = await this.updateDto(dto);
        return dto;
    };

    public search = async (
        filters: DiagnosisSearchFilters
    ): Promise<DiagnosisSearchResults | DiagnosisSearchResults> => {
        var items = [];
        var results = await this._diagnosisRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }
        results.Items = items;
        return results;
    };

    public update = async (
        id: uuid,
        updateModel: DiagnosisDomainModel
    ): Promise<DiagnosisDto> => {
        var dto = await this._diagnosisRepo.update(id, updateModel);
        dto = await this.updateDto(dto);
        return dto;
    };

    //#endregion

    //#region Privates

    private updateDto = async (dto: DiagnosisDto): Promise<DiagnosisDto> => {
        if (dto == null) {
            return null;
        }
        
        return dto;
    }

    getById = async (id: uuid): Promise<DiagnosisDto> => {
        return await this._diagnosisRepo.getById(id);
    };

    //search = async (filters: DiagnosisSearchFilters): Promise<DiagnosisSearchResults> => {
    //return await this._diagnosisRepo.search(filters);
    //};

    //update = async (id: uuid, diagnosisDomainModel: DiagnosisDomainModel): Promise<DiagnosisDto> => {
    //return await this._diagnosisRepo.update(id, diagnosisDomainModel);
    //};

    delete = async (id: uuid): Promise<boolean> => {
        return await this._diagnosisRepo.delete(id);
    };

    //#endregion

}
