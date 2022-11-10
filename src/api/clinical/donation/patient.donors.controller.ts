import express from 'express';
import { PatientDonorsService } from '../../../services/clinical/donation/patient.donors.service';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { Loader } from '../../../startup/loader';
import { BaseController } from '../../base.controller';
import { PatientDonorsValidator } from './patient.donors.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientDonorsController extends BaseController {

    //#region member variables and constructors

    _service: PatientDonorsService = null;

    _validator: PatientDonorsValidator = new PatientDonorsValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(PatientDonorsService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('PatientDonors.Create', request, response);

            const domainModel = await this._validator.create(request);

            const patientDonors = await this._service.create(domainModel);
            if (patientDonors == null) {
                throw new ApiError(400, 'Cannot create Blood bridge!');
            }

            ResponseHandler.success(request, response, 'Blood bridge created successfully!', 201, {
                PatientDonors : patientDonors,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('PatientDonors.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const doctorNote = await this._service.getById(id);
            if (doctorNote == null) {
                throw new ApiError(404, 'Blood bridge not found.');
            }

            ResponseHandler.success(request, response, 'Blood bridge retrieved successfully!', 200, {
                PatientDonors : doctorNote,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('PatientDonors.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} blood bridge records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { PatientDonors: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('PatientDonors.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const doctorNote = await this._service.getById(id);
            if (doctorNote == null) {
                throw new ApiError(404, 'Blood bridge not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update blood bridge record!');
            }

            ResponseHandler.success(request, response, 'Blood bridge record updated successfully!', 200, {
                PatientDonors : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('PatientDonors.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const doctorNote = await this._service.getById(id);
            if (doctorNote == null) {
                throw new ApiError(404, 'Blood bridge not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Blood bridge cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Blood bridge record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
