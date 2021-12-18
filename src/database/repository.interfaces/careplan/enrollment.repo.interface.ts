import { EnrollmentDomainModel } from '../../../modules/careplan/domain.types/enrollment/enrollment.domain.model';
import { EnrollmentDto } from "../../../modules/careplan/domain.types/enrollment/enrollment.dto";

export interface IEnrollmentRepo {

    create(enrollmentDomainModel: EnrollmentDomainModel): Promise<EnrollmentDto>;

}
