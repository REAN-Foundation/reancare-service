import { BabyDomainModel } from "../../../../domain.types/clinical/maternity/baby/baby.domain.model";
import { BabyDto } from "../../../../domain.types/clinical/maternity/baby/baby.dto";

export interface IBabyRepo {

    create(babyDomainModel: BabyDomainModel): Promise<BabyDto>;

    getById(babyId: string): Promise<BabyDto>;

}
