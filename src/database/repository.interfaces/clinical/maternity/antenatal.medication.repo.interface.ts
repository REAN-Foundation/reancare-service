import { AntenatalMedicationDomainModel } from "../../../../domain.types/clinical/maternity/antenatal.medication/antenatal.medication.domain.model";
import { AntenatalMedicationDto } from "../../../../domain.types/clinical/maternity/antenatal.medication/antenatal.medication.dto";

export interface IAntenatalMedicationRepo {

    create(medicationDomainModel: AntenatalMedicationDomainModel): Promise<AntenatalMedicationDto>;

    getById(antenatalMedicationId: string): Promise<AntenatalMedicationDto>;

    update(antenatalMedicationId: string, medicationDomainModel: AntenatalMedicationDomainModel): Promise<AntenatalMedicationDto>;

    delete(antenatalMedicationId: string): Promise<boolean>;
}