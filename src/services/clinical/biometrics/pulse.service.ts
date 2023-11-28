import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IPulseRepo } from "../../../database/repository.interfaces/clinical/biometrics/pulse.repo.interface ";
import { PulseDomainModel } from '../../../domain.types/clinical/biometrics/pulse/pulse.domain.model';
import { PulseDto } from '../../../domain.types/clinical/biometrics/pulse/pulse.dto';
import { PulseSearchFilters, PulseSearchResults } from '../../../domain.types/clinical/biometrics/pulse/pulse.search.types';
import { PulseStore } from "../../../modules/ehr/services/pulse.store";
import { Loader } from "../../../startup/loader";
import { ConfigurationManager } from "../../../config/configuration.manager";
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";
import { EHRRecordTypes } from "../../../modules/ehr.analytics/ehr.record.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PulseService {

    _ehrPulseStore: PulseStore = null;

    constructor(
        @inject('IPulseRepo') private _pulseRepo: IPulseRepo,
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrPulseStore = Loader.container.resolve(PulseStore);
        }
    }

    create = async (pulseDomainModel: PulseDomainModel):
    Promise<PulseDto> => {

        if (this._ehrPulseStore) {
            const ehrId = await this._ehrPulseStore.add(pulseDomainModel);
            pulseDomainModel.EhrId = ehrId;
        }

        var dto = await this._pulseRepo.create(pulseDomainModel);
        return dto;
    };

    getById = async (id: uuid): Promise<PulseDto> => {
        return await this._pulseRepo.getById(id);
    };

    search = async (filters: PulseSearchFilters): Promise<PulseSearchResults> => {
        return await this._pulseRepo.search(filters);
    };

    update = async (id: uuid, pulseDomainModel: PulseDomainModel):
    Promise<PulseDto> => {
        var dto = await this._pulseRepo.update(id, pulseDomainModel);
        if (this._ehrPulseStore) {
            await this._ehrPulseStore.update(dto.EhrId, dto);
        }
        return dto;
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._pulseRepo.delete(id);
    };

    getAllUserResponsesBetween = async (patientUserId: string, dateFrom: Date, dateTo: Date)
        : Promise<any[]> => {
        return await this._pulseRepo.getAllUserResponsesBetween(patientUserId, dateFrom, dateTo);
    };

    getAllUserResponsesBefore = async (patientUserId: string, date: Date)
        : Promise<any[]> => {
        return await this._pulseRepo.getAllUserResponsesBefore(patientUserId, date);
    };

    public addEHRRecord = (patientUserId: uuid, recordId: uuid, provider: string, model: PulseDomainModel, appName?: string) => {
        if (model.Pulse) {
            EHRAnalyticsHandler.addIntegerRecord(
                patientUserId, recordId, provider, EHRRecordTypes.Pulse, model.Pulse, model.Unit, null, null, appName, 
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

}
