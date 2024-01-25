import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { BloodPressureService } from '../../../../services/clinical/biometrics/blood.pressure.service';
import { Loader } from '../../../../startup/loader';
import { BloodPressureValidator } from './blood.pressure.validator';
import { Logger } from '../../../../common/logger';
import { BloodPressureDomainModel } from '../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';
import { PersonService } from '../../../../services/person/person.service';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../common/time.helper';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { Injector } from '../../../../startup/injector';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { UserDeviceDetailsService } from '../../../../services/users/user/user.device.details.service';
import { EHRVitalService } from '../../../../modules/ehr.analytics/ehr.services/ehr.vital.service';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodPressureController {

    //#region member variables and constructors

    _validator: BloodPressureValidator = new BloodPressureValidator();

    _service: BloodPressureService = Injector.Container.resolve(BloodPressureService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _patientService: PatientService = Injector.Container.resolve(PatientService);

    _userDeviceDetailsService: UserDeviceDetailsService = Injector.Container.resolve(UserDeviceDetailsService);

    _ehrVitalService = Injector.Container.resolve(EHRVitalService);

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            const bloodPressure = await this._service.create(model);
            if (bloodPressure == null) {
                throw new ApiError(400, 'Cannot create record for blood pressure!');
            }

            await this._ehrVitalService.addEHRBloodPressureForAppNames(bloodPressure);

            /*if (model.Systolic > 120 || model.Diastolic > 80) {
                this.sendBPMessage(model.PatientUserId, model);
                await this._service.sendBPNotification(model.PatientUserId, model);
            }*/

            // Adding record to award service
            if (bloodPressure.Systolic || bloodPressure.Diastolic) {
                var timestamp = bloodPressure.RecordDate;
                if (!timestamp) {
                    timestamp = new Date();
                }
                const currentTimeZone = await HelperRepo.getPatientTimezone(bloodPressure.PatientUserId);
                const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(bloodPressure.PatientUserId);
                const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);

                AwardsFactsService.addOrUpdateVitalFact({
                    PatientUserId : bloodPressure.PatientUserId,
                    Facts         : {
                        VitalName           : "BloodPressure",
                        VitalPrimaryValue   : bloodPressure.Systolic,
                        VitalSecondaryValue : bloodPressure.Diastolic,
                        Unit                : bloodPressure.Unit,
                    },
                    RecordId       : bloodPressure.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
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

            await this._ehrVitalService.addEHRBloodPressureForAppNames(updated);

            // Adding record to award service
            if (updated.Systolic || updated.Diastolic) {
                var timestamp = updated.RecordDate;
                if (!timestamp) {
                    timestamp = new Date();
                }
                const currentTimeZone = await HelperRepo.getPatientTimezone(updated.PatientUserId);
                const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(updated.PatientUserId);
                const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);

                AwardsFactsService.addOrUpdateVitalFact({
                    PatientUserId : updated.PatientUserId,
                    Facts         : {
                        VitalName           : "BloodPressure",
                        VitalPrimaryValue   : updated.Systolic,
                        VitalSecondaryValue : updated.Diastolic,
                        Unit                : updated.Unit,
                    },
                    RecordId       : updated.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }
            ResponseHandler.success(request, response, 'Blood pressure record updated successfully!', 200, {
                BloodPressure : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood pressure record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Blood pressure record cannot be deleted.');
            }

            // delete ehr record
            this._ehrVitalService.deleteRecord(existingRecord.id);

            ResponseHandler.success(request, response, 'Blood pressure record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

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
