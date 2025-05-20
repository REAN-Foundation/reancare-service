import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IPostnatalMedicationRepo } from "../../../database/repository.interfaces/clinical/maternity/postnatal.medication.repo.interface";
import { PostnatalMedicationDomainModel } from "../../../domain.types/clinical/maternity/postnatal.medication/postnatal.medication.domain.model";
import { PostnatalMedicationDto } from "../../../domain.types/clinical/maternity/postnatal.medication/postnatal.medication.dto";
////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PostnatalMedicationService {

    constructor(
        @inject('IPostnatalMedicationRepo') private _postnatalMedicationRepo: IPostnatalMedicationRepo,
    ) { }

    create = async (postnatalMedicationDomainModel: PostnatalMedicationDomainModel): Promise<PostnatalMedicationDto> => {
        return await this._postnatalMedicationRepo.create(postnatalMedicationDomainModel);
    };

    getById = async (postnatalMedicationId: uuid): Promise<PostnatalMedicationDto> => {
        return await this._postnatalMedicationRepo.getById(postnatalMedicationId);
    };

    update = async (postnatalMedicationId: uuid, postnatalMedicationDomainModel: PostnatalMedicationDomainModel): Promise<PostnatalMedicationDto> => {
        return await this._postnatalMedicationRepo.update(postnatalMedicationId, postnatalMedicationDomainModel);
    };

    delete = async (postnatalMedicationId: uuid): Promise<boolean> => {
        return await this._postnatalMedicationRepo.delete(postnatalMedicationId);
    };

}