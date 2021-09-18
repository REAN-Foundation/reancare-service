import { inject, injectable } from "tsyringe";
import { IBodyTemperatureRepo } from "../../database/repository.interfaces/biometrics/body.temperature.repo.interface";
import { BodyTemperatureDomainModel } from '../../domain.types/biometrics/body.temperature/body.temperature.domain.model';
import { BodyTemperatureDto } from '../../domain.types/biometrics/body.temperature/body.temperature.dto';
import { BodyTemperatureSearchResults, BodyTemperatureSearchFilters } from '../../domain.types/biometrics/body.temperature/body.temperature.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BodyTemperatureService {

    constructor(
        @inject('IBodyTemperatureRepo') private _bodyTemperatureRepo: IBodyTemperatureRepo,
    ) { }

    create = async (bodyTemperatureDomainModel: BodyTemperatureDomainModel):
    Promise<BodyTemperatureDto> => {
        return await this._bodyTemperatureRepo.create(bodyTemperatureDomainModel);
    };

    getById = async (id: string): Promise<BodyTemperatureDto> => {
        return await this._bodyTemperatureRepo.getById(id);
    };

    search = async (filters: BodyTemperatureSearchFilters): Promise<BodyTemperatureSearchResults> => {
        return await this._bodyTemperatureRepo.search(filters);
    };

    update = async (id: string, bodyTemperatureDomainModel: BodyTemperatureDomainModel):
    Promise<BodyTemperatureDto> => {
        return await this._bodyTemperatureRepo.update(id, bodyTemperatureDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._bodyTemperatureRepo.delete(id);
    };

}

