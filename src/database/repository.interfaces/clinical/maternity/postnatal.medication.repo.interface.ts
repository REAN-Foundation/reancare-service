import { PostnatalMedicationDomainModel } from "../../../../domain.types/clinical/maternity/postnatal.medication/postnatal.medication.domain.model";
import { PostnatalMedicationDto } from "../../../../domain.types/clinical/maternity/postnatal.medication/postnatal.medication.dto";

export interface IPostnatalMedicationRepo {

    create(postnatalMedicationDomainModel: PostnatalMedicationDomainModel): Promise<PostnatalMedicationDto>;

    getById(id: string): Promise<PostnatalMedicationDto>;

    update(id: string, postnatalMedicationDomainModel: PostnatalMedicationDomainModel): Promise<PostnatalMedicationDto>;

    delete(id: string): Promise<boolean>;

}
