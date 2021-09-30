import express from 'express';

import { DiagnosisService } from '../../../services/clinical/diagnosis.service';
import { UserService } from '../../../services/user.service';
import { PersonService } from '../../../services/person.service';
import { PatientService } from '../../../services/patient/patient.service';
import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { Authorizer } from '../../../auth/authorizer';
import { DiagnosisValidator } from '../../validators/clinical/diagnosis.validator';
import { ApiError } from '../../../common/api.error';

//import { DiagnosisDomainModel } from '../../domain.types/diagnosis/diagnosis.domain.model';
//import { PatientDomainModel } from '../../domain.types/patient/patient/patient.domain.model';
//import { PersonDomainModel } from '../../domain.types/person/person.domain.model';
//import { DiagnosisDto } from '../../domain.types/diagnosis/diagnosis.dto';

///////////////////////////////////////////////////////////////////////////////////////

export class DiagnosisController {

    //#region member variables and constructors

    _service: DiagnosisService = null;

    _userService: UserService = null;

    _personService: PersonService = null;

    _patientService: PatientService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(DiagnosisService);
        this._userService = Loader.container.resolve(UserService);
        this._personService = Loader.container.resolve(PersonService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Diagnosis.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await DiagnosisValidator.create(request);

            if (domainModel.PatientUserId != null) {
                const person = await this._userService.getById(domainModel.PatientUserId);
                if (person == null) {
                    throw new ApiError(404, `User with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            const diagnosis = await this._service.create(domainModel);
            if (diagnosis == null) {
                throw new ApiError(400, 'Cannot create diagnosis!');
            }

            ResponseHandler.success(request, response, 'diagnosis created successfully!', 201, {
                Diagnosis : diagnosis,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Diagnosis.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await DiagnosisValidator.getById(request);
            const medicalPractitionerUserId: string = await DiagnosisValidator.getById(request);

            const existingUser = await this._service.getById(id);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const medicalPractitioner = await this._service.getById(medicalPractitionerUserId);
            if (medicalPractitioner == null) {
                throw new ApiError(404, 'Medical practitioner not found.');
            }

            ResponseHandler.success(request, response, 'Diagnosis retrieved successfully!', 200, {
                Diagnosis : medicalPractitioner,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Diagnosis.Search';
            await this._authorizer.authorize(request, response);

            const filters = await DiagnosisValidator.search(request);

            // const extractFull: boolean =
            //     request.query.fullDetails !== 'undefined' && typeof request.query.fullDetails === 'boolean'
            //         ? request.query.fullDetails
            //         : false;

            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0 ? 'No records found!' : `Total ${count} diagnosis records retrieved successfully!`;
                
            ResponseHandler.success(request, response, message, 200, {
                Diagnosis : searchResults,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Diagnosis.Update';
            await this._authorizer.authorize(request, response);

            const diagnosisDomainModel = await DiagnosisValidator.update(request);

            const id: string = await DiagnosisValidator.getById(request);
            const existingUser = await this._service.getByUserId(id);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const updatedDiagnosis = await this._service.update(
                diagnosisDomainModel.id,
                diagnosisDomainModel
            );
            if (updatedDiagnosis == null) {
                throw new ApiError(400, 'Unable to update diagnosis record!');
            }

            ResponseHandler.success(request, response, 'Diagnosis records updated successfully!', 200, {
                Diagnosis : updatedDiagnosis,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Diagnosis.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await DiagnosisValidator.getById(request);
            const existingUser = await this._service.getById(id);
            if (existingUser == null) {
                throw new ApiError(404, 'Diagnosis record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Diagnosis record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Diagnosis record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
