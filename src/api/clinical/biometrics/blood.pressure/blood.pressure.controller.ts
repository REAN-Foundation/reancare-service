import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { BloodPressureService } from '../../../../services/clinical/biometrics/blood.pressure.service';
import { Loader } from '../../../../startup/loader';
import { BloodPressureValidator } from './blood.pressure.validator';
import { BaseController } from '../../../base.controller';
import { Logger } from '../../../../common/logger';
import { BloodPressureDomainModel } from '../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';
import { EHRAnalyticsHandler } from '../../../../custom/ehr.analytics/ehr.analytics.handler';
import { EHRRecordTypes } from '../../../../custom/ehr.analytics/ehr.record.types';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { UserDeviceDetailsService } from '../../../../services/users/user/user.device.details.service';
import { PersonService } from '../../../../services/person/person.service';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodPressureController extends BaseController {

    //#region member variables and constructors

    _service: BloodPressureService = null;

    _patientService: PatientService = null;

    _personService: PersonService = null;

    _userDeviceDetailsService: UserDeviceDetailsService = null;

    _validator: BloodPressureValidator = new BloodPressureValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(BloodPressureService);
        this._patientService = Loader.container.resolve(PatientService);
        this._personService = Loader.container.resolve(PersonService);
        this._userDeviceDetailsService = Loader.container.resolve(UserDeviceDetailsService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodPressure.Create', request, response);

            const model = await this._validator.create(request);
            const bloodPressure = await this._service.create(model);
            if (bloodPressure == null) {
                throw new ApiError(400, 'Cannot create record for blood pressure!');
            }
            this.addEHRRecord(model.PatientUserId, bloodPressure.id, model);
            if (model.Systolic > 120 || model.Diastolic > 80) {
                this.sendBPMessage(model.PatientUserId, model);
                await this._service.sendBPNotification(model.PatientUserId, model);
            }
            ResponseHandler.success(request, response, 'Blood pressure record created successfully!', 201, {
                BloodPressure : bloodPressure,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodPressure.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const bloodPressure = await this._service.getById(id);
            if (bloodPressure == null) {
                throw new ApiError(404, ' Blood pressure record not found.');
            }

            ResponseHandler.success(request, response, 'Blood pressure record retrieved successfully!', 200, {
                BloodPressure : bloodPressure,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodPressure.Search', request, response);

            Logger.instance().log(`trying to fetch data for search...`);
            const filters = await this._validator.search(request);
            Logger.instance().log(`Validations passed:: ${JSON.stringify(filters)}`);
            const searchResults = await this._service.search(filters);
            Logger.instance().log(`result length.: ${searchResults.Items.length}`);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} blood pressure records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                BloodPressureRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodPressure.Update', request, response);

            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood Pressure record not found.');
            }

            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update blood pressure record!');
            }
            this.addEHRRecord(model.PatientUserId, id, model);
            ResponseHandler.success(request, response, 'Blood pressure record updated successfully!', 200, {
                BloodPressure : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodPressure.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood pressure record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Blood pressure record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Blood pressure record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    private addEHRRecord = (patientUserId: uuid, recordId: uuid, model: BloodPressureDomainModel) => {
        if (model.Systolic) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                EHRRecordTypes.BloodPressure,
                model.Systolic,
                model.Unit,
                'Systolic Blood Pressure',
                'Blood Pressure');
        }
        if (model.Diastolic) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                EHRRecordTypes.BloodPressure,
                model.Diastolic,
                model.Unit,
                'Distolic Blood Pressure',
                'Blood Pressure');
        }
    };

    private sendBPMessage = async (patientUserId: uuid, model: BloodPressureDomainModel) => {
        
        const patient  = await this._patientService.getByUserId(patientUserId);
        const phoneNumber = patient.User.Person.Phone;
        const person = await this._personService.getById(patient.User.PersonId);
        var userFirstName = 'user';
        if (person && person.FirstName) {
            userFirstName = person.FirstName;
        }
        const message = `Dear ${userFirstName}, Your recent systolic blood pressure is ${model.Systolic} and diastolic blood pressure is ${model.Diastolic}, it is Elevated.\nPlease consult your doctor.\nBlood pressure category will change based on systolic and diastolic.`;
        const sendStatus = await Loader.messagingService.sendSMS(phoneNumber, message);
        if (sendStatus) {
            Logger.instance().log(`Message sent successfully`);
        }

        return true;
    };

    //#endregion

}
