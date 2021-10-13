import { DrugDomainModel } from "../../../../domain.types/clinical/medication/drug/drug.domain.model";
import { DrugDto } from "../../../../domain.types/clinical/medication/drug/drug.dto";
import { DrugSearchFilters, DrugSearchResults } from "../../../../domain.types/clinical/medication/drug/drug.search.types";

export interface IDrugRepo {

    create(drugDomainModel: DrugDomainModel): Promise<DrugDto>;

    getById(id: string): Promise<DrugDto>;
    
    getByName(drugName: string): Promise<DrugDto>;
    
    search(filters: DrugSearchFilters): Promise<DrugSearchResults>;

    update(id: string, drugDomainModel: DrugDomainModel):
    Promise<DrugDto>;

    delete(id: string): Promise<boolean>;

    totalCount(): Promise<number>;
}
