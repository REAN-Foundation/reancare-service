import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBodyTemperatureRepo } from "../../../database/repository.interfaces/clinical/biometrics/body.temperature.repo.interface";
import { BodyTemperatureDomainModel } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model';
import { BodyTemperatureDto } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto';
import { BodyTemperatureSearchFilters, BodyTemperatureSearchResults } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.search.types';
import { TemperatureStore } from "../../../modules/ehr/services/body.temperature.store";
import { Loader } from "../../../startup/loader";
import { Logger } from "../../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BodyTemperatureService {

    _ehrTemperatureStore: TemperatureStore = null;

    constructor(
        @inject('IBodyTemperatureRepo') private _bodyTemperatureRepo: IBodyTemperatureRepo,
    ) {
        this._ehrTemperatureStore = Loader.container.resolve(TemperatureStore);

    }

    create = async (bodyTemperatureDomainModel: BodyTemperatureDomainModel):
    Promise<BodyTemperatureDto> => {

        const ehrId = await this._ehrTemperatureStore.add(bodyTemperatureDomainModel);
        bodyTemperatureDomainModel.EhrId = ehrId;
        Logger.instance().log(`EHR Id for body temperature model: ${JSON.stringify(bodyTemperatureDomainModel.EhrId)}`);
        var dto = await this._bodyTemperatureRepo.create(bodyTemperatureDomainModel);
        return dto;
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
