import { uuid } from "../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IVisitRepo } from "../../database/repository.interfaces/clinical/visit.repo.interface";
import { VisitDomainModel } from '../../domain.types/clinical/visit/visit.domain.model';
import { VisitDto } from '../../domain.types/clinical/visit/visit.dto';
import { VisitSearchFilters, VisitSearchResults } from '../../domain.types/clinical/visit/visit.search.type';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class VisitService {

    constructor(
        @inject('IVisitRepo') private _visitRepo: IVisitRepo,
    ) { }

    create = async (visitDomainModel: VisitDomainModel):
    Promise<VisitDto> => {
        return await this._visitRepo.create(visitDomainModel);
    };

    getById = async (id: uuid): Promise<VisitDto> => {
        return await this._visitRepo.getById(id);
    };

    search = async (filters: VisitSearchFilters): Promise<VisitSearchResults> => {
        return await this._visitRepo.search(filters);
    };

    update = async (id: uuid, visitDomainModel: VisitDomainModel):
    Promise<VisitDto> => {
        return await this._visitRepo.update(id, visitDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._visitRepo.delete(id);
    };

}
