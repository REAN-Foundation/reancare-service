import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBodyWeightRepo } from "../../../database/repository.interfaces/clinical/biometrics/body.weight.repo.interface";
import { BodyWeightDomainModel } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';
import { BodyWeightDto } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.dto';
import { BodyWeightSearchFilters, BodyWeightSearchResults } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BodyWeightService {

    constructor(
        @inject('IBodyWeightRepo') private _bodyWeightRepo: IBodyWeightRepo,
    ) {}

    create = async (bodyWeightDomainModel: BodyWeightDomainModel): Promise<BodyWeightDto> => {
        return await this._bodyWeightRepo.create(bodyWeightDomainModel);
    };

    getById = async (id: uuid): Promise<BodyWeightDto> => {
        return await this._bodyWeightRepo.getById(id);
    };

    search = async (filters: BodyWeightSearchFilters): Promise<BodyWeightSearchResults> => {
        return await this._bodyWeightRepo.search(filters);
    };

    update = async (id: uuid, bodyWeightDomainModel: BodyWeightDomainModel): Promise<BodyWeightDto> => {
        return await this._bodyWeightRepo.update(id, bodyWeightDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bodyWeightRepo.delete(id);
    };

}
