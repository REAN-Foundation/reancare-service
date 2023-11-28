import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBodyTemperatureRepo } from "../../../database/repository.interfaces/clinical/biometrics/body.temperature.repo.interface";
import { BodyTemperatureDomainModel } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model';
import { BodyTemperatureDto } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto';
import { BodyTemperatureSearchFilters, BodyTemperatureSearchResults } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.search.types';
import { TemperatureStore } from "../../../modules/ehr/services/body.temperature.store";
import { Loader } from "../../../startup/loader";
import { ConfigurationManager } from "../../../config/configuration.manager";
import { EHRRecordTypes } from "../../../modules/ehr.analytics/ehr.record.types";
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BodyTemperatureService {

    _ehrTemperatureStore: TemperatureStore = null;

    constructor(
        @inject('IBodyTemperatureRepo') private _bodyTemperatureRepo: IBodyTemperatureRepo,
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrTemperatureStore = Loader.container.resolve(TemperatureStore);
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

    public addEHRRecord = (patientUserId: uuid, recordId: uuid, provider: string, model: BodyTemperatureDomainModel, appName?: string) => {
        if (model.BodyTemperature) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId, recordId, provider, EHRRecordTypes.BodyTemperature, model.BodyTemperature, model.Unit, null, null, appName, 
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

}
