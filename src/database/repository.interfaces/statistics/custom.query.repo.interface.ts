
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { CustomQueryDomainModel } from "../../../domain.types/statistics/custom.query/custom.query.domain.model";
import { CustomQueryDto } from "../../../domain.types/statistics/custom.query/custom.query.dto";
import { CustomQuerySearchFilters } from "../../../domain.types/statistics/custom.query/custom.query.search.type";
import { CustomQuerySearchResults } from "../../../domain.types/statistics/custom.query/custom.query.search.type";

////////////////////////////////////////////////////////////////////
export interface ICustomQueryRepo {

    executeQuery(model: CustomQueryDomainModel): Promise<any>;
    
    getById(id: uuid): Promise<CustomQueryDto>;

    search(filters: CustomQuerySearchFilters): Promise<CustomQuerySearchResults>;

    update(id: uuid, updateModel: CustomQueryDomainModel): Promise<any>;

    delete(id: uuid): Promise<boolean>;
}
