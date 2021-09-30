import { inject, injectable } from "tsyringe";
import { IComplaintRepo } from "../../database/repository.interfaces/clinical/complaint.repo.interface";
import { ComplaintDomainModel } from '../../domain.types/clinical/complaint/complaint.domain.model';
import { ComplaintDto } from '../../domain.types/clinical/complaint/complaint.dto';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ComplaintService {

    constructor(
        @inject('IComplaintRepo') private _complaintRepo: IComplaintRepo,
    ) {}

    create = async (complaintDomainModel: ComplaintDomainModel): Promise<ComplaintDto> => {
        return await this._complaintRepo.create(complaintDomainModel);
    };

    getById = async (id: string): Promise<ComplaintDto> => {
        return await this._complaintRepo.getById(id);
    };

    search = async (id: string): Promise<ComplaintDto[]> => {
        return await this._complaintRepo.search(id);
    };

    update = async (id: string, complaintDomainModel: ComplaintDomainModel): Promise<ComplaintDto> => {
        return await this._complaintRepo.update(id, complaintDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._complaintRepo.delete(id);
    };

}
