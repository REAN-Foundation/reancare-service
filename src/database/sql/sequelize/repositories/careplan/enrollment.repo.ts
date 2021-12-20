import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { EnrollmentDomainModel } from "../../../../../modules/careplan/domain.types/enrollment/enrollment.domain.model";
import { EnrollmentDto } from "../../../../../modules/careplan/domain.types/enrollment/enrollment.dto";
import { IEnrollmentRepo } from "../../../../repository.interfaces/careplan/enrollment.repo.interface";
import { EnrollmentMapper } from "../../mappers/careplan/enrollment.mapper";
import Enrollment from "../../models/careplan/enrollment.model";

///////////////////////////////////////////////////////////////////////

export class EnrollmentRepo implements IEnrollmentRepo {
    
    create = async (createModel: EnrollmentDomainModel):
    Promise<EnrollmentDto> => {
        try {
            const entity = {
                UserId        : createModel.UserId,
                Provider      : createModel.Provider,
                ParticipantId : createModel.ParticipantId,
                EnrollmentId  : createModel.EnrollmentId,
                PlanCode      : createModel.PlanCode,
                PlanName      : createModel.PlanName,
                StartDate     : createModel.StartDate,
                EndDate       : createModel.EndDate,
                Gender        : createModel.Gender,
            };

            const enrollment = await Enrollment.create(entity);
            return await EnrollmentMapper.toDto(enrollment);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
