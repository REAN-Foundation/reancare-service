import { BreastfeedingDomainModel } from "../../../../domain.types/clinical/maternity/breastfeeding/breastfeeding.domain.model";
import { BreastfeedingDto } from "../../../../domain.types/clinical/maternity/breastfeeding/breastfeeding.dto";

export interface IBreastfeedingRepo {

    create(breastfeedingDomainModel: BreastfeedingDomainModel): Promise<BreastfeedingDto>;

    getById(breastfeedingId: string): Promise<BreastfeedingDto>;

    update(breastfeedingId: string, breastfeedingDomainModel: BreastfeedingDomainModel): Promise<BreastfeedingDto>;

}
