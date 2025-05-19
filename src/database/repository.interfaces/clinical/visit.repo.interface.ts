import { VisitDomainModel } from "../../../domain.types/clinical/visit/visit.domain.model";
import { VisitDto } from "../../../domain.types/clinical/visit/visit.dto";
import { VisitSearchFilters, VisitSearchResults } from "../../../domain.types/clinical/visit/visit.search.type";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IVisitRepo {

    create(visitDomainModel: VisitDomainModel): Promise<VisitDto>;

    getById(id: string): Promise<VisitDto>;
    
    search(filters: VisitSearchFilters): Promise<VisitSearchResults>;

    update(id: string, visitDomainModel: VisitDomainModel): Promise<VisitDto>;

    delete(id: string): Promise<boolean>;

}
