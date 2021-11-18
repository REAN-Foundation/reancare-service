import { inject, injectable } from "tsyringe";
import { IComplaintRepo } from "../../database/repository.interfaces/clinical/complaint.repo.interface";
import { ComplaintDomainModel } from '../../domain.types/clinical/complaint/complaint.domain.model';
import { ComplaintDto } from '../../domain.types/clinical/complaint/complaint.dto';
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { BaseResourceService } from "../../services/base.resource.service";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ComplaintService extends BaseResourceService {

    constructor(
        @inject('IComplaintRepo') private _complaintRepo: IComplaintRepo,
    ) {
        super();
    }

    create = async (complaintDomainModel: ComplaintDomainModel): Promise<ComplaintDto> => {
        return await this._complaintRepo.create(complaintDomainModel);
    };

    getById = async (id: uuid): Promise<ComplaintDto> => {
        return await this._complaintRepo.getById(id);
    };

    search = async (id: uuid): Promise<ComplaintDto[]> => {
        return await this._complaintRepo.search(id);
    };

    update = async (id: uuid, complaintDomainModel: ComplaintDomainModel): Promise<ComplaintDto> => {
        return await this._complaintRepo.update(id, complaintDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._complaintRepo.delete(id);
    };

}
