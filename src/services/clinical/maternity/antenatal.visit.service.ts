import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IAntenatalVisitRepo } from "../../../database/repository.interfaces/clinical/maternity/antenatal.visit.repo.interface";
import { AntenatalVisitDomainModel } from "../../../domain.types/clinical/maternity/antenatal.visit/antenatal.visit.domain.type";
import { AntenatalVisitDto } from "../../../domain.types/clinical/maternity/antenatal.visit/antenatal.visit.dto";
////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AntenatalVisitService {

    constructor(
        @inject('IAntenatalVisitRepo') private _antenatalVisitRepo: IAntenatalVisitRepo,
    ) { }

    create = async (visitDomainModel: AntenatalVisitDomainModel): Promise<AntenatalVisitDto> => {
        return await this._antenatalVisitRepo.create(visitDomainModel);
    };

    getById = async (antenatalVisitId: uuid): Promise<AntenatalVisitDto> => {
        return await this._antenatalVisitRepo.getById(antenatalVisitId);
    };

    update = async (antenatalVisitId: uuid, visitDomainModel: AntenatalVisitDomainModel): Promise<AntenatalVisitDto> => {
        return await this._antenatalVisitRepo.update(antenatalVisitId, visitDomainModel);
    };

    delete = async (antenatalVisitId: uuid): Promise<boolean> => {
        return await this._antenatalVisitRepo.delete(antenatalVisitId);
    };

}
