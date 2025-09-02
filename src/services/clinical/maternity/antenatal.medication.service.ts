import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IAntenatalMedicationRepo } from "../../../database/repository.interfaces/clinical/maternity/antenatal.medication.repo.interface";
import { AntenatalMedicationDomainModel } from "../../../domain.types/clinical/maternity/antenatal.medication/antenatal.medication.domain.model";
import { AntenatalMedicationDto } from "../../../domain.types/clinical/maternity/antenatal.medication/antenatal.medication.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AntenatalMedicationService {

    constructor(
        @inject('IAntenatalMedicationRepo') private _antenatalMedicationRepo: IAntenatalMedicationRepo,
    ) { }

    create = async (medicationDomainModel: AntenatalMedicationDomainModel): Promise<AntenatalMedicationDto> => {
        return await this._antenatalMedicationRepo.create(medicationDomainModel);
    };

    getById = async (id: uuid): Promise<AntenatalMedicationDto> => {
        return await this._antenatalMedicationRepo.getById(id);
    };

    update = async (antenatalMedicationId: uuid, medicationDomainModel: AntenatalMedicationDomainModel): Promise<AntenatalMedicationDto> => {
        return await this._antenatalMedicationRepo.update(antenatalMedicationId, medicationDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._antenatalMedicationRepo.delete(id);
    };

}