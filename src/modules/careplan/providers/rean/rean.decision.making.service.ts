import { inject, injectable } from "tsyringe";
import { ICareplanRepo } from "../../../../database/repository.interfaces/clinical/careplan.repo.interface";
import { EnrollmentDomainModel } from '../../../../domain.types/clinical/careplan/enrollment/enrollment.domain.model';
import { EnrollmentDto } from '../../../../domain.types/clinical/careplan/enrollment/enrollment.dto';
import { ApiError } from "../../../../common/api.error";
import { CareplanHandler } from '../../../../modules/careplan/careplan.handler';
import { Logger } from "../../../../common/logger";

@injectable()
export class HighRiskCareplanService {

    _handler: CareplanHandler = new CareplanHandler();

    constructor(
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo
    ) {}

    deleteFutureCareplanTask = async(enrollment: EnrollmentDto): Promise<number> => {
        try {

            const deletedCount = await this._careplanRepo.deleteFutureCareplanTask(enrollment);
            return deletedCount;
            
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
