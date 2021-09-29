import { DrugDomainModel } from "../../../domain.types/medication/drug/drug.domain.model";
import { DrugDto } from "../../../domain.types/medication/drug/drug.dto";
import { DrugSearchFilters, DrugSearchResults } from "../../../domain.types/medication/drug/drug.search.types";

export interface IDrugRepo {

    create(drugDomainModel: DrugDomainModel): Promise<DrugDto>;

    getById(id: string): Promise<DrugDto>;
    
    search(filters: DrugSearchFilters): Promise<DrugSearchResults>;

    update(id: string, drugDomainModel: DrugDomainModel):
    Promise<DrugDto>;

    delete(id: string): Promise<boolean>;

}
