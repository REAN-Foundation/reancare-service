import { inject, injectable } from "tsyringe";
import { CustomQueryDomainModel } from "../../domain.types/statistics/custom.query/custom.query.domain.model";
import { ICustomQueryRepo } from "../../database/repository.interfaces/statistics/custom.query.repo.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { CustomQueryDto } from "../../domain.types/statistics/custom.query/custom.query.dto";
import { CustomQuerySearchFilters } from "../../domain.types/statistics/custom.query/custom.query.search.type";
import { CustomQuerySearchResults } from "../../domain.types/statistics/custom.query/custom.query.search.type";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CustomQueryService {

    constructor(
        @inject('ICustomQueryRepo') private _customQueryRepo: ICustomQueryRepo,
    ) {}
 
    executeQuery = async (model: CustomQueryDomainModel): Promise<any> => {
        return await this._customQueryRepo.executeQuery(model);
    };

    getById = async (id: uuid): Promise<CustomQueryDto> => {
        return await this._customQueryRepo.getById(id);
    };

    search = async (filters: CustomQuerySearchFilters): Promise<CustomQuerySearchResults> => {
        var dtos = await this._customQueryRepo.search(filters);
        return dtos;
    };

    update = async (id: uuid, updateModel: CustomQueryDomainModel):
    Promise<any> => {
        return await this._customQueryRepo.update(id, updateModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._customQueryRepo.delete(id);
    };
    
}
