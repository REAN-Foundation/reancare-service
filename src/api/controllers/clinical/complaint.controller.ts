import express from 'express';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { ComplaintService } from '../../../services/clinical/complaint.service';
import { DoctorService } from '../../../services/doctor.service';
import { PatientService } from '../../../services/patient/patient.service';
import { PersonService } from '../../../services/person.service';
import { RoleService } from '../../../services/role.service';
import { Loader } from '../../../startup/loader';
import { ComplaintValidator } from '../../validators/clinical/complaint.validator';



///////////////////////////////////////////////////////////////////////////////////////

export class ComplaintController {

    //#region member variables and constructors

    _service: ComplaintService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _patientService: PatientService = null;

    _authorizer: Authorizer = null;

    _doctorService: DoctorService = null;

    constructor() {
        this._service = Loader.container.resolve(ComplaintService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._patientService = Loader.container.resolve(PatientService);
        this._doctorService = Loader.container.resolve(DoctorService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Complaint.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await ComplaintValidator.create(request);

            if (domainModel.PatientUserId != null) {
                const patientUser = await this._patientService.getByUserId(domainModel.PatientUserId);
                if (patientUser == null) {
                    throw new ApiError(404, `Patient with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            if (domainModel.MedicalPractitionerUserId != null) {
                var organization = await this._doctorService.getByUserId(domainModel.MedicalPractitionerUserId);
                if (organization == null) {
                    throw new ApiError(404, `Medical Practitioner with an id ${domainModel.MedicalPractitionerUserId} cannot be found.`);
                }
            }

            const complaint = await this._service.create(domainModel);
            if (complaint == null) {
                throw new ApiError(400, 'Cannot create complaint!');
            }

            ResponseHandler.success(request, response, 'Complaint created successfully!', 201, {
                Complaint : complaint,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Complaint.GetById';
            
            await this._authorizer.authorize(request, response);

            const id: string = await ComplaintValidator.getById(request);

            const complaint = await this._service.getById(id);
            if (complaint == null) {
                throw new ApiError(404, 'Complaint not found.');
            }

            ResponseHandler.success(request, response, 'Complaint retrieved successfully!', 200, {
                Complaint : complaint,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Complaint.Search';
            await this._authorizer.authorize(request, response);

            const filters = await ComplaintValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} complaint records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { Complaints: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Complaint.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await ComplaintValidator.update(request);

            const id: string = await ComplaintValidator.getById(request);
            const existingComplaint = await this._service.getById(id);
            if (existingComplaint == null) {
                throw new ApiError(404, 'Complaint not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update complaint record!');
            }

            ResponseHandler.success(request, response, 'Complaint record updated successfully!', 200, {
                Complaint : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Complaint.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await ComplaintValidator.getById(request);
            const existingComplaint = await this._service.getById(id);
            if (existingComplaint == null) {
                throw new ApiError(404, 'Complaint not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Complaint cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Complaint record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
