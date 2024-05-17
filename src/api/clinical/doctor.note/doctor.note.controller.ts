import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { DoctorNoteService } from '../../../services/clinical/doctor.note.service';
import { DoctorNoteValidator } from './doctor.note.validator';
import { Injector } from '../../../startup/injector';
import { BaseController } from '../../../api/base.controller';
import { DoctorNoteSearchFilters } from '../../../domain.types/clinical/doctor.note/doctor.note.search.types';
import { PermissionHandler } from '../../../auth/custom/permission.handler';
import { UserService } from '../../../services/users/user/user.service';

///////////////////////////////////////////////////////////////////////////////////////

export class DoctorNoteController extends BaseController {

    //#region member variables and constructors

    _service: DoctorNoteService = Injector.Container.resolve(DoctorNoteService);

    _validator: DoctorNoteValidator = new DoctorNoteValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.create(request);
            await this.authorizeUser(request, domainModel.PatientUserId);
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
            await this.authorizeUser(request, doctorNote.PatientUserId);
            ResponseHandler.success(request, response, 'Doctor Note retrieved successfully!', 200, {
                DoctorNote : doctorNote,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            let filters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
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
            await this.authorizeUser(request, doctorNote.PatientUserId);
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
            await this.authorizeUser(request, doctorNote.PatientUserId);
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

    private authorizeUser = async (request: express.Request, ownerUserId: uuid) => {
        const _userService: UserService = Injector.Container.resolve(UserService);
        const user = await _userService.getById(ownerUserId);
        if (!user) {
            throw new ApiError(404, `User with Id ${ownerUserId} not found.`);
        }
        request.resourceOwnerUserId = ownerUserId;
        request.resourceTenantId = user.TenantId;
        await this.authorizeOne(request, ownerUserId, user.TenantId);
    };

    private authorizeSearch = async (
        request: express.Request,
        searchFilters: DoctorNoteSearchFilters): Promise<DoctorNoteSearchFilters> => {

        const currentUser = request.currentUser;

        if (searchFilters.PatientUserId != null) {
            if (searchFilters.PatientUserId !== request.currentUser.UserId) {
                const hasConsent = await PermissionHandler.checkConsent(
                    searchFilters.PatientUserId,
                    currentUser.UserId,
                    request.context
                );
                if (!hasConsent) {
                    throw new ApiError(403, `Unauthorized`);
                }
            }
        }
        else {
            searchFilters.PatientUserId = currentUser.UserId;
        }
        return searchFilters;
    };
    //#endregion

}
