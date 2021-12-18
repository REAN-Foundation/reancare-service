import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { EnrollmentService } from '../../../services/careplan/enrollment.service';
import { Loader } from '../../../startup/loader';
import { EnrollmentValidator } from '../../validators/careplan/enrollment.validator';
import { BaseController } from '../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class EnrollmentController extends BaseController {

    //#region member variables and constructors
    _service: EnrollmentService = null;

    _validator: EnrollmentValidator = new EnrollmentValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(EnrollmentService);

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            this.setContext('Careplan.Enrollment.Create', request, response);

            const enrollmentDomainModel = await this._validator.create(request);

            const enrollment = await this._service.create(enrollmentDomainModel);
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
