import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { DoctorNoteService } from '../../../services/clinical/doctor.note.service';
import { DoctorNoteValidator } from './doctor.note.validator';
import { Injector } from '../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class DoctorNoteController {

    //#region member variables and constructors

    _service: DoctorNoteService = Injector.Container.resolve(DoctorNoteService);

    _validator: DoctorNoteValidator = new DoctorNoteValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.create(request);

            const doctorNote = await this._service.create(domainModel);
            if (doctorNote == null) {
                throw new ApiError(400, 'Cannot create Doctor Note!');
            }

            ResponseHandler.success(request, response, 'Doctor Note created successfully!', 201, {
                DoctorNote : doctorNote,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const doctorNote = await this._service.getById(id);
            if (doctorNote == null) {
                throw new ApiError(404, 'Doctor Note not found.');
            }

            ResponseHandler.success(request, response, 'Doctor Note retrieved successfully!', 200, {
                DoctorNote : doctorNote,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} Doctor Note records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { DoctorNotes: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const doctorNote = await this._service.getById(id);
            if (doctorNote == null) {
                throw new ApiError(404, 'Doctor Note not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update Doctor Note record!');
            }

            ResponseHandler.success(request, response, 'Doctor Note record updated successfully!', 200, {
                DoctorNote : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const doctorNote = await this._service.getById(id);
            if (doctorNote == null) {
                throw new ApiError(404, 'Doctor Note not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Doctor Note cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Doctor Note record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
