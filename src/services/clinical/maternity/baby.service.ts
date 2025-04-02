import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IBabyRepo } from "../../../database/repository.interfaces/clinical/maternity/baby.repo.interface";
import { BabyDomainModel } from "../../../domain.types/clinical/maternity/baby/baby.domain.model";
import { BabyDto } from "../../../domain.types/clinical/maternity/baby/baby.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BabyService {

    constructor(
        @inject('IBabyRepo') private _babyRepo: IBabyRepo,
    ) { }

    create = async (babyDomainModel: BabyDomainModel): Promise<BabyDto> => {
        return await this._babyRepo.create(babyDomainModel);
    };

    getById = async (babyId: uuid): Promise<BabyDto> => {
        return await this._babyRepo.getById(babyId);
    };

}
