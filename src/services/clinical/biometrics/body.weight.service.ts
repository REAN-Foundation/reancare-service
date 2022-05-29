import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBodyWeightRepo } from "../../../database/repository.interfaces/clinical/biometrics/body.weight.repo.interface";
import { BodyWeightDomainModel } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';
import { BodyWeightDto } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.dto';
import { BodyWeightSearchFilters, BodyWeightSearchResults } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.search.types';
import { BodyWeightStore } from "../../../modules/ehr/services/body.weight.store";
import { Loader } from "../../../startup/loader";
import { ConfigurationManager } from "../../../config/configuration.manager";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BodyWeightService {

    _ehrBodyWeightStore: BodyWeightStore = null;

    constructor(
        @inject('IBodyWeightRepo') private _bodyWeightRepo: IBodyWeightRepo,
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrBodyWeightStore = Loader.container.resolve(BodyWeightStore);
        }
    }

    create = async (bodyWeightDomainModel: BodyWeightDomainModel): Promise<BodyWeightDto> => {

        if (this._ehrBodyWeightStore) {            
            const ehrId = await this._ehrBodyWeightStore.add(bodyWeightDomainModel);
            bodyWeightDomainModel.EhrId = ehrId;
        }

        var dto = await this._bodyWeightRepo.create(bodyWeightDomainModel);
        return dto;
    };

    getById = async (id: uuid): Promise<BodyWeightDto> => {
        return await this._bodyWeightRepo.getById(id);
    };

    search = async (filters: BodyWeightSearchFilters): Promise<BodyWeightSearchResults> => {
        return await this._bodyWeightRepo.search(filters);
    };

    update = async (id: uuid, bodyWeightDomainModel: BodyWeightDomainModel): Promise<BodyWeightDto> => {
        var dto = await this._bodyWeightRepo.update(id, bodyWeightDomainModel);
        if (this._ehrBodyWeightStore) { 
            await this._ehrBodyWeightStore.update(dto.EhrId, dto);
        }
        return dto;
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._bodyWeightRepo.delete(id);
    };

}
