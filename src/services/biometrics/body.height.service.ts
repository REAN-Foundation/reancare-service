import { inject, injectable } from "tsyringe";
import { IBodyHeightRepo } from "../../database/repository.interfaces/biometrics/body.height.repo.interface";
import { BodyHeightDomainModel } from '../../domain.types/biometrics/body.height/body.height.domain.model';
import { BodyHeightDto } from '../../domain.types/biometrics/body.height/body.height.dto';
import { BodyHeightSearchFilters, BodyHeightSearchResults } from '../../domain.types/biometrics/body.height/body.height.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BodyHeightService {

    constructor(
        @inject('IBodyHeightRepo') private _bodyHeightRepo: IBodyHeightRepo,
    ) {}

    create = async (bodyHeightDomainModel: BodyHeightDomainModel): Promise<BodyHeightDto> => {
        return await this._bodyHeightRepo.create(bodyHeightDomainModel);
    };

    getById = async (id: string): Promise<BodyHeightDto> => {
        return await this._bodyHeightRepo.getById(id);
    };

    search = async (filters: BodyHeightSearchFilters): Promise<BodyHeightSearchResults> => {
        return await this._bodyHeightRepo.search(filters);
    };

    update = async (id: string, BodyHeightDomainModel: BodyHeightDomainModel): Promise<BodyHeightDto> => {
        return await this._bodyHeightRepo.update(id, BodyHeightDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._bodyHeightRepo.delete(id);
    };

}
