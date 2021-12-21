import express from 'express';
import { CareplanService } from '../../../services/careplan/careplan.service';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { CareplanValidator } from '../../validators/careplan/careplan.validator';
import { BaseController } from '../base.controller';
import { UserService } from '../../../services/user/user.service';
import { TimeHelper } from '../../../common/time.helper';
import { DurationType } from '../../../domain.types/miscellaneous/time.types';

///////////////////////////////////////////////////////////////////////////////////////

export class CareplanController extends BaseController {

    //#region member variables and constructors
    _service: CareplanService = null;

    _userSservice: UserService = null;

    _validator: CareplanValidator = new CareplanValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(CareplanService);
        this._userSservice = Loader.container.resolve(UserService);
    }

    //#endregion

    //#region Action methods

    enrollPatient = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            this.setContext('Careplan.EnrollParticipant', request, response);

            const enrollmentDomainModel = await this._validator.enrollPatient(request);

            var startDate = await this._userSservice.getDateInUserTimeZone(
                enrollmentDomainModel.UserId, enrollmentDomainModel.StartDateStr);

            var endDate = await this._userSservice.getDateInUserTimeZone(
                enrollmentDomainModel.UserId, enrollmentDomainModel.EndDateStr);

            endDate = TimeHelper.addDuration(endDate, 1, DurationType.Day);

            enrollmentDomainModel.StartDate = startDate;
            enrollmentDomainModel.EndDate = endDate;

            const enrollment = await this._service.enrollPatient(enrollmentDomainModel);
            if (enrollment == null) {
                throw new ApiError(400, 'Cannot enroll patient to careplan!');
            }

            ResponseHandler.success(request, response, 'Patient enrollment done successfully!', 201, {
                Enrollment : enrollment,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
