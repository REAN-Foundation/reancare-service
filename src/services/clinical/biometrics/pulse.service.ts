import { inject, injectable } from "tsyringe";
import { IPulseRepo } from "../../../database/repository.interfaces/clinical/biometrics/pulse.repo.interface ";
import { PulseDomainModel } from '../../../domain.types/clinical/biometrics/pulse/pulse.domain.model';
import { PulseDto } from '../../../domain.types/clinical/biometrics/pulse/pulse.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PulseSearchFilters, PulseSearchResults } from '../../../domain.types/clinical/biometrics/pulse/pulse.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PulseService {

    constructor(
        @inject('IPulseRepo') private _pulseRepo: IPulseRepo,
    ) { }

    create = async (pulseDomainModel: PulseDomainModel):
    Promise<PulseDto> => {
        return await this._pulseRepo.create(pulseDomainModel);
    };

    getById = async (id: string): Promise<PulseDto> => {
        return await this._pulseRepo.getById(id);
    };

    search = async (filters: PulseSearchFilters): Promise<PulseSearchResults> => {
        return await this._pulseRepo.search(filters);
    };

    update = async (id: string, pulseDomainModel: PulseDomainModel):
    Promise<PulseDto> => {
        return await this._pulseRepo.update(id, pulseDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._pulseRepo.delete(id);
    };

}
