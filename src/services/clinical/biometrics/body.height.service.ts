import { BiometricsHeightStore } from "../../../modules/ehr/services/biometrics.height.store";
import { Loader } from "../../../startup/loader";
import { inject, injectable } from "tsyringe";
import { IBodyHeightRepo } from "../../../database/repository.interfaces/clinical/biometrics/body.height.repo.interface";
import { BodyHeightDomainModel } from '../../../domain.types/clinical/biometrics/body.height/body.height.domain.model';
import { BodyHeightDto } from '../../../domain.types/clinical/biometrics/body.height/body.height.dto';
import { BodyHeightSearchFilters, BodyHeightSearchResults } from '../../../domain.types/clinical/biometrics/body.height/body.height.search.types';
import { ConfigurationManager } from "../../../config/configuration.manager";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";
import { EHRRecordTypes } from "../../../modules/ehr.analytics/ehr.record.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BodyHeightService {

    _ehrBiometricsHeightStore: BiometricsHeightStore = null;

    constructor(
        @inject('IBodyHeightRepo') private _bodyHeightRepo: IBodyHeightRepo,
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrBiometricsHeightStore = Loader.container.resolve(BiometricsHeightStore);
        }
    }

    create = async (bodyHeightDomainModel: BodyHeightDomainModel): Promise<BodyHeightDto> => {

        if (this._ehrBiometricsHeightStore) {
            const ehrId = await this._ehrBiometricsHeightStore.add(bodyHeightDomainModel);
            bodyHeightDomainModel.EhrId = ehrId;
        }

        var dto = await this._bodyHeightRepo.create(bodyHeightDomainModel);
        return dto;
    };

    getById = async (id: string): Promise<BodyHeightDto> => {
        return await this._bodyHeightRepo.getById(id);
    };

    search = async (filters: BodyHeightSearchFilters): Promise<BodyHeightSearchResults> => {
        return await this._bodyHeightRepo.search(filters);
    };

    update = async (id: string, BodyHeightDomainModel: BodyHeightDomainModel): Promise<BodyHeightDto> => {
        var dto = await this._bodyHeightRepo.update(id, BodyHeightDomainModel);
        if (this._ehrBiometricsHeightStore) {
            await this._ehrBiometricsHeightStore.update(dto.EhrId, dto);
        }
        return dto;
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._bodyHeightRepo.delete(id);
    };

    public addEHRRecord = (patientUserId: uuid, recordId: uuid, provider: string, model: BodyHeightDomainModel, appName?: string) => {
        if (model.BodyHeight) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId, recordId, provider, EHRRecordTypes.BodyHeight, model.BodyHeight, model.Unit, null, null, appName, 
                model.RecordDate ? model.RecordDate : null
            );

            //Also add it to the static record
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                BodyHeight : model.BodyHeight
            }, appName);
        }
    };

}
