import { inject, injectable } from "tsyringe";
import { IBodyHeightRepo } from "../../../database/repository.interfaces/clinical/biometrics/body.height.repo.interface";
import { BodyHeightDomainModel } from '../../../domain.types/clinical/biometrics/body.height/body.height.domain.model';
import { BodyHeightDto } from '../../../domain.types/clinical/biometrics/body.height/body.height.dto';
import { BodyHeightSearchFilters, BodyHeightSearchResults } from '../../../domain.types/clinical/biometrics/body.height/body.height.search.types';
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BaseResourceService } from "../../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BodyHeightService extends BaseResourceService {

    constructor(
        @inject('IBodyHeightRepo') private _bodyHeightRepo: IBodyHeightRepo,
    ) {
        super();
    }

    create = async (bodyHeightDomainModel: BodyHeightDomainModel): Promise<BodyHeightDto> => {
        return await this._bodyHeightRepo.create(bodyHeightDomainModel);
    };

    getById = async (id: uuid): Promise<BodyHeightDto> => {
        return await this._bodyHeightRepo.getById(id);
    };

    search = async (filters: BodyHeightSearchFilters): Promise<BodyHeightSearchResults> => {
        return await this._bodyHeightRepo.search(filters);
    };

    update = async (id: uuid, BodyHeightDomainModel: BodyHeightDomainModel): Promise<BodyHeightDto> => {
        return await this._bodyHeightRepo.update(id, BodyHeightDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bodyHeightRepo.delete(id);
    };

}
