import { inject, injectable } from "tsyringe";
import { IPulseRepo } from "../../../database/repository.interfaces/clinical/biometrics/pulse.repo.interface ";
import { PulseDomainModel } from '../../../domain.types/clinical/biometrics/pulse/pulse.domain.model';
import { PulseDto } from '../../../domain.types/clinical/biometrics/pulse/pulse.dto';
import { PulseSearchFilters, PulseSearchResults } from '../../../domain.types/clinical/biometrics/pulse/pulse.search.types';
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BaseResourceService } from "../../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PulseService extends BaseResourceService {

    constructor(
        @inject('IPulseRepo') private _pulseRepo: IPulseRepo,
    ) {
        super();
    }

    create = async (pulseDomainModel: PulseDomainModel):
    Promise<PulseDto> => {
        return await this._pulseRepo.create(pulseDomainModel);
    };

    getById = async (id: uuid): Promise<PulseDto> => {
        return await this._pulseRepo.getById(id);
    };

    search = async (filters: PulseSearchFilters): Promise<PulseSearchResults> => {
        return await this._pulseRepo.search(filters);
    };

    update = async (id: uuid, pulseDomainModel: PulseDomainModel):
    Promise<PulseDto> => {
        return await this._pulseRepo.update(id, pulseDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._pulseRepo.delete(id);
    };

}
