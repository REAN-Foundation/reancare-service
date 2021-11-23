import { inject, injectable } from 'tsyringe';
import { IDiagnosisRepo } from '../../database/repository.interfaces/clinical/diagnosis.repo.interface';
import { DiagnosisDomainModel } from '../../domain.types/clinical/diagnosis/diagnosis.domain.model';
import { DiagnosisDto } from '../../domain.types/clinical/diagnosis/diagnosis.dto';
import { DiagnosisSearchFilters, DiagnosisSearchResults } from '../../domain.types/clinical/diagnosis/diagnosis.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DiagnosisService {

    constructor(
        @inject('IDiagnosisRepo') private _diagnosisRepo: IDiagnosisRepo,
    ) { }

    create = async (diagnosisDomainModel: DiagnosisDomainModel): Promise<DiagnosisDto> => {

        return await this._diagnosisRepo.create(diagnosisDomainModel);
    };

    getById = async (id: string): Promise<DiagnosisDto> => {
        return await this._diagnosisRepo.getById(id);
    };

    search = async (filters: DiagnosisSearchFilters): Promise<DiagnosisSearchResults> => {
        return await this._diagnosisRepo.search(filters);
    };

    update = async (id: string, diagnosisDomainModel: DiagnosisDomainModel):
    Promise<DiagnosisDto> => {
        return await this._diagnosisRepo.update(id, diagnosisDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._diagnosisRepo.delete(id);
    };

}
