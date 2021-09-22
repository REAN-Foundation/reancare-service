import express from 'express';

import { Helper } from '../../common/helper';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { Authorizer } from '../../auth/authorizer';
import { PersonService } from '../../services/person.service';

import { ApiError } from '../../common/api.error';
import { DoctorNoteValidator } from '../validators/doctor.note.validator';
import { DoctorNoteService } from '../../services/doctor.note.service';
import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user.service';

///////////////////////////////////////////////////////////////////////////////////////

export class DoctorNoteController {

    //#region member variables and constructors

    _service: DoctorNoteService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _userService: UserService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(DoctorNoteService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._userService = Loader.container.resolve(UserService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DoctorNote.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await DoctorNoteValidator.create(request);

            if (domainModel.PatientUserId != null) {
                const person = await this._userService.getById(domainModel.PatientUserId);
                if (person == null) {
                    throw new ApiError(404, `User with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

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
            request.context = 'DoctorNote.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await DoctorNoteValidator.getById(request);

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
            request.context = 'DoctorNote.Search';
            await this._authorizer.authorize(request, response);

            const filters = await DoctorNoteValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} Doctor Note records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { DoctorNote: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DoctorNote.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await DoctorNoteValidator.update(request);

            const id: string = await DoctorNoteValidator.getById(request);
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
            request.context = 'DoctorNote.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await DoctorNoteValidator.getById(request);
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
