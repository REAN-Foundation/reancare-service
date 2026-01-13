import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBodyTemperatureRepo } from "../../../database/repository.interfaces/clinical/biometrics/body.temperature.repo.interface";
import { BodyTemperatureDomainModel } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model';
import { BodyTemperatureDto } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto';
import { BodyTemperatureSearchFilters, BodyTemperatureSearchResults } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.search.types';
import { TemperatureStore } from "../../../modules/ehr/services/body.temperature.store";
import { ConfigurationManager } from "../../../config/configuration.manager";
import { Injector } from "../../../startup/injector";
import { MostRecentActivityDto } from "../../../domain.types/users/patient/activity.tracker/activity.tracker.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BodyTemperatureService {

    _ehrTemperatureStore: TemperatureStore = null;

    constructor(
        @inject('IBodyTemperatureRepo') private _bodyTemperatureRepo: IBodyTemperatureRepo,
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrTemperatureStore = Injector.Container.resolve(TemperatureStore);
        }
    }

    create = async (bodyTemperatureDomainModel: BodyTemperatureDomainModel):
    Promise<BodyTemperatureDto> => {

        if (this._ehrTemperatureStore) {
            const ehrId = await this._ehrTemperatureStore.add(bodyTemperatureDomainModel);
            bodyTemperatureDomainModel.EhrId = ehrId;
        }

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
        var dto = await this._bodyTemperatureRepo.update(id, bodyTemperatureDomainModel);
        if (this._ehrTemperatureStore) {
            await this._ehrTemperatureStore.update(dto.EhrId, dto);
        }
        return dto;
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bodyTemperatureRepo.delete(id);
    };

    getAllUserResponsesBetween = async (patientUserId: string, dateFrom: Date, dateTo: Date)
        : Promise<any[]> => {
        return await this._bodyTemperatureRepo.getAllUserResponsesBetween(patientUserId, dateFrom, dateTo);
    };

    getAllUserResponsesBefore = async (patientUserId: string, date: Date)
        : Promise<any[]> => {
        return await this._bodyTemperatureRepo.getAllUserResponsesBefore(patientUserId, date);
    };

    getMostRecentBodyTemperatureActivity = async (patientUserId: uuid): Promise<MostRecentActivityDto> => {
        return await this._bodyTemperatureRepo.getMostRecentBodyTemperatureActivity(patientUserId);
    };

    deleteByUserId = async (patientUserId: string, hardDelete: boolean = true): Promise<boolean> => {
        return await this._bodyTemperatureRepo.deleteByUserId(patientUserId, hardDelete);
    };

}
