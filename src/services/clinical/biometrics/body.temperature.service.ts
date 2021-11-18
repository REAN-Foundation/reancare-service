import { inject, injectable } from "tsyringe";
import { IBodyTemperatureRepo } from "../../../database/repository.interfaces/clinical/biometrics/body.temperature.repo.interface";
import { BodyTemperatureDomainModel } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model';
import { BodyTemperatureDto } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto';
import { BodyTemperatureSearchFilters, BodyTemperatureSearchResults } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.search.types';
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BaseResourceService } from "../../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BodyTemperatureService extends BaseResourceService {

    constructor(
        @inject('IBodyTemperatureRepo') private _bodyTemperatureRepo: IBodyTemperatureRepo,
    ) {
        super();
    }

    create = async (bodyTemperatureDomainModel: BodyTemperatureDomainModel):
    Promise<BodyTemperatureDto> => {
        return await this._bodyTemperatureRepo.create(bodyTemperatureDomainModel);
    };

    getById = async (id: uuid): Promise<BodyTemperatureDto> => {
        return await this._bodyTemperatureRepo.getById(id);
    };

    search = async (filters: BodyTemperatureSearchFilters): Promise<BodyTemperatureSearchResults> => {
        return await this._bodyTemperatureRepo.search(filters);
    };

    update = async (id: uuid, bodyTemperatureDomainModel: BodyTemperatureDomainModel):
    Promise<BodyTemperatureDto> => {
        return await this._bodyTemperatureRepo.update(id, bodyTemperatureDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bodyTemperatureRepo.delete(id);
    };

}
