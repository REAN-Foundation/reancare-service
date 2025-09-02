import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IComplicationRepo } from "../../../database/repository.interfaces/clinical/maternity/complication.repo.interface";
import { ComplicationDomainModel } from "../../../domain.types/clinical/maternity/complication/complication.domain.model";
import { ComplicationDto } from "../../../domain.types/clinical/maternity/complication/complication.dto";
import { ComplicationSearchFilter, ComplicationSearchResults } from "../../../domain.types/clinical/maternity/complication/complication.search.type";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ComplicationService {

    constructor(
        @inject('IComplicationRepo') private _complicationRepo: IComplicationRepo,
    ) { }

    create = async (complicationDomainModel: ComplicationDomainModel): Promise<ComplicationDto> => {
        return await this._complicationRepo.create(complicationDomainModel);
    };

    getById = async (complicationId: uuid): Promise<ComplicationDto> => {
        return await this._complicationRepo.getById(complicationId);
    };

    search = async (filters: ComplicationSearchFilter): Promise<ComplicationSearchResults> => {
        return await this._complicationRepo.search(filters);
    };

    update = async (complicationId: uuid, complicationDomainModel: ComplicationDomainModel): Promise<ComplicationDto> => {
        return await this._complicationRepo.update(complicationId, complicationDomainModel);
    };

    delete = async (complicationId: uuid): Promise<boolean> => {
        return await this._complicationRepo.delete(complicationId);
    };

}
