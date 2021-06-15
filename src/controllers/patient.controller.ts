import express from 'express';
import { query, body, oneOf, validationResult, param } from 'express-validator';

import { PatientService } from '../services/patient.service';
import { Helper } from '../common/helper';
import { ResponseHandler } from '../common/response.handler';
import { Loader } from '../startup/loader';
import { Authorizer } from '../auth/authorizer';
import { PatientInputValidator } from './input.validators/patient.input.validator';
import { PatientDomainModel } from '../data/domain.types/patient.domain.types';
import { UserService } from '../services/user.service';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientController {

    //#region member variables and constructors

    _service: PatientService = null;
    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(PatientService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.Create';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
            var entity: PatientDomainModel = await PatientInputValidator.create(request, response);
            var patientsSharingPhone = await PatientService.CheckforExistingPatient(entity);
            const patient = await this._service.create(patientEntity);
            if (user == null) {
                ResponseHandler.failure(request, response, 'User not found.', 404);
                return;
            }
            ResponseHandler.success(request, response, 'User retrieved successfully!', 200, {
                user: user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByUserId = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.GetByUserId';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
            var id: string = await PatientInputValidator.getByUserId(request, response);
            const user = await this._service.getById(id);
            if (user == null) {
                ResponseHandler.failure(request, response, 'User not found.', 404);
                return;
            }
            ResponseHandler.success(request, response, 'User retrieved successfully!', 200, {
                user: user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.Search';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
            var filters = await PatientInputValidator.search(request, response);

            var extractFull: boolean =
                request.query.full != 'undefined' && typeof request.query.full == 'boolean'
                    ? request.query.full
                    : false;

            const users = await this._service.search(filters, extractFull);
            if (users != null) {
                var count = users.length;
                var message =
                    count == 0 ? 'No records found!' : `Total ${count} user records retrieved successfully!`;
                ResponseHandler.success(request, response, message, 200, {
                    users: users,
                });
                return;
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    
    updateByUserId = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.UpdateByUserId';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
            var id: string = await PatientInputValidator.updateByUserId(request, response);
            const user = await this._service.getById(id);
            if (user == null) {
                ResponseHandler.failure(request, response, 'User not found.', 404);
                return;
            }
            ResponseHandler.success(request, response, 'User retrieved successfully!', 200, {
                user: user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion
};