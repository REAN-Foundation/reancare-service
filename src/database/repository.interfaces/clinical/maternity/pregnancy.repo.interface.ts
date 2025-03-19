import { PregnancyDomainModel } from "../../../../domain.types/clinical/maternity/pregnancy/pregnancy.domain.model";
import { PregnancyDetailsDto,PregnancyDto } from "../../../../domain.types/clinical/maternity/pregnancy/pregnancy.dto";
import { PregnancySearchFilters, PregnancySearchResults } from "../../../../domain.types/clinical/maternity/pregnancy/pregnancy.search.type";

export interface IPregnancyRepo {

    create(pregnancyDomainModel: PregnancyDomainModel): Promise<PregnancyDetailsDto>;

    getById(id: string): Promise<PregnancyDto>;

    search(filters: PregnancySearchFilters): Promise<PregnancySearchResults>;

    update(id: string, pregnancyDomainModel: PregnancyDomainModel): Promise<PregnancyDto>;

    delete(id: string): Promise<boolean>;

}
