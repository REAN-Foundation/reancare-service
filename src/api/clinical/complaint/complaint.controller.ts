import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ComplaintService } from '../../../services/clinical/complaint.service';
import { DoctorService } from '../../../services/users/doctor/doctor.service';
import { PatientService } from '../../../services/users/patient/patient.service';
import { ComplaintValidator } from './complaint.validator';
import { Injector } from '../../../startup/injector';
import { BaseController } from '../../../api/base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class ComplaintController extends BaseController{

    //#region member variables and constructors

    _service: ComplaintService = Injector.Container.resolve(ComplaintService);

    _validator: ComplaintValidator = new ComplaintValidator();

    _patientService: PatientService = Injector.Container.resolve(PatientService);

    _doctorService: DoctorService = Injector.Container.resolve(DoctorService);

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.create(request);

            if (domainModel.PatientUserId != null) {
                const patientUser = await this._patientService.getByUserId(domainModel.PatientUserId);
                if (patientUser == null) {
                    throw new ApiError(404, `Patient with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }
            await this.authorizeOne(request, domainModel.PatientUserId);
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

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const complaint = await this._service.getById(id);
            if (complaint == null) {
                throw new ApiError(404, 'Complaint not found.');
            }
            await this.authorizeOne(request, complaint.PatientUserId);
            ResponseHandler.success(request, response, 'Complaint retrieved successfully!', 200, {
                Complaint : complaint,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const patientUserId = await this._validator.search(request);
            await this.authorizeOne(request, patientUserId);
            const searchResults = await this._service.search(patientUserId);

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
            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingComplaint = await this._service.getById(id);
            await this.authorizeOne(request, existingComplaint.PatientUserId);
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

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingComplaint = await this._service.getById(id);
            await this.authorizeOne(request, existingComplaint.PatientUserId);
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
