import { ComplicationDomainModel } from "../../../../domain.types/clinical/maternity/complication/complication.domain.model";
import { ComplicationDto } from "../../../../domain.types/clinical/maternity/complication/complication.dto";
import { ComplicationSearchFilter, ComplicationSearchResults } from "../../../../domain.types/clinical/maternity/complication/complication.search.type";

export interface IComplicationRepo {

    create(complicationDomainModel: ComplicationDomainModel): Promise<ComplicationDto>;

    getById(complicationId: string): Promise<ComplicationDto>;

    search(filters: ComplicationSearchFilter): Promise<ComplicationSearchResults>;

    update(complicationId: string, complicationDomainModel: ComplicationDomainModel): Promise<ComplicationDto>;

    delete(complicationId: string): Promise<boolean>;

}
