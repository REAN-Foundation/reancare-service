import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBreastfeedingRepo } from "../../../database/repository.interfaces/clinical/maternity/breastfeeding.repo.interface";
import { BreastfeedingDomainModel } from "../../../domain.types/clinical/maternity/breastfeeding/breastfeeding.domain.model";
import { BreastfeedingDto } from "../../../domain.types/clinical/maternity/breastfeeding/breastfeeding.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BreastfeedingService {

    constructor(
        @inject('IBreastfeedingRepo') private _breastfeedingRepo: IBreastfeedingRepo,
    ) { }

    create = async (breastfeedingDomainModel: BreastfeedingDomainModel): Promise<BreastfeedingDto> => {
        return await this._breastfeedingRepo.create(breastfeedingDomainModel);
    };

    getById = async (breastfeedingId: uuid): Promise<BreastfeedingDto> => {
        return await this._breastfeedingRepo.getById(breastfeedingId);
    };

    update = async (breastfeedingId: uuid, breastfeedingDomainModel: BreastfeedingDomainModel): Promise<BreastfeedingDto> => {
        return await this._breastfeedingRepo.update(breastfeedingId, breastfeedingDomainModel);
    };

}
