import express from 'express';
import { CareplanService } from '../../../services/careplan/careplan.service';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { CareplanValidator } from '../../validators/careplan/careplan.validator';
import { BaseController } from '../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class CareplanController extends BaseController {

    //#region member variables and constructors
    _service: CareplanService = null;

    _validator: CareplanValidator = new CareplanValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(CareplanService);
    }

    //#endregion

    //#region Action methods

    enrollParticipant = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            this.setContext('Careplan.EnrollParticipant', request, response);

            const enrollmentDomainModel = await this._validator.enrollParticipant(request);

            const enrollment = await this._service.enrollParticipant(enrollmentDomainModel);
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
