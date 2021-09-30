import { ComplaintDomainModel } from "../../../domain.types/clinical/complaint/complaint.domain.model";
import { ComplaintDto } from "../../../domain.types/clinical/complaint/complaint.dto";

export interface IComplaintRepo {

    create(complaintDomainModel: ComplaintDomainModel): Promise<ComplaintDto>;

    getById(id: string): Promise<ComplaintDto>;

    search(is: string): Promise<ComplaintDto[]>;

    update(id: string, complaintDomainModel: ComplaintDomainModel): Promise<ComplaintDto>;

    delete(id: string): Promise<boolean>;

}
