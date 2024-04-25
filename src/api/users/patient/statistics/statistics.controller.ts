import express from 'express';
import * as path from 'path';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { FileResourceService } from '../../../../services/general/file.resource.service';
import { PatientStatisticsService } from '../../../../services/users/patient/statistics/patient.statistics.service';
import { Loader } from '../../../../startup/loader';
import { StatisticsValidator } from './statistics.validator';
import { Helper } from '../../../../common/helper';
import { DocumentDomainModel } from '../../../../domain.types/users/patient/document/document.domain.model';
import { Logger } from '../../../../common/logger';
import { DocumentTypes } from '../../../../domain.types/users/patient/document/document.types';
import { DocumentService } from '../../../../services/users/patient/document.service';
import { TimeHelper } from '../../../../common/time.helper';
import { DateStringFormat } from '../../../../domain.types/miscellaneous/time.types';
import { PersonService } from '../../../../services/person/person.service';
import { ConfigurationManager } from '../../../../config/configuration.manager';
import { Injector } from '../../../../startup/injector';
import { ApiError } from '../../../../common/api.error';
import { UserService } from '../../../../services/users/user/user.service';
import { HealthReportSettingService } from '../../../../services/users/patient/health.report.setting.service';
import { HealthReportSettingsDomainModel, ReportFrequency, Settings } from '../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { PatientBaseController } from '../patient.base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class StatisticsController extends PatientBaseController {

    //#region member variables and constructors

    _service: PatientStatisticsService = Injector.Container.resolve(PatientStatisticsService);

    _fileResourceService: FileResourceService = Injector.Container.resolve(FileResourceService);

    _patientService: PatientService = Injector.Container.resolve(PatientService);
    
    _userService: UserService = Injector.Container.resolve(UserService);

    _documentService: DocumentService = Injector.Container.resolve(DocumentService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _healthReportSettingService: HealthReportSettingService = Injector.Container.resolve(HealthReportSettingService);

    _validator: StatisticsValidator = new StatisticsValidator();

    //#endregion

    //#region Action methods

    getPatientStats = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const patientUserId: string = await this._validator.getParamUuid(request, 'patientUserId');
            await this.authorizeOne(request, patientUserId);
            const stats = await this._service.getPatientStats(patientUserId);
            ResponseHandler.success(request, response, 'Document retrieved successfully!', 200, {
                Statistics : stats,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPatientHealthSummary = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            // request.context = 'PatientStatistics.getPatientHealthSummary'; ???

            const patientUserId: string = await this._validator.getParamUuid(request, 'patientUserId');
            await this.authorizeOne(request, patientUserId);
            const existingUser = await this._userService.getById(patientUserId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const patientHealthSummary =  await this._service.getHealthSummary(patientUserId);
            ResponseHandler.success(
                request,
                response,
                'Patient health summary retrieved successfully!',
                200,
                patientHealthSummary
            );
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPatientStatsReport = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const patientUserId: string = await this._validator.getParamUuid(request, 'patientUserId');
            await this.authorizeOne(request, patientUserId);
            const clientCode = request.currentClient.ClientCode;
            
            let reportSettings = await this._healthReportSettingService.getReportSettingsByUserId(patientUserId);

            if (!reportSettings) {
                const model = this.getHealthReportSettingModel(patientUserId);
                reportSettings = await this._healthReportSettingService.createReportSettings(model);
                if (!reportSettings) {
                    reportSettings.Preference = model.Preference;
                }
            }

            const settings = reportSettings.Preference;

            this.triggerReportGeneration(patientUserId, clientCode, settings);
            ResponseHandler.success(
                request,
                response,
                'Your health report is getting downloaded, please check in the medical records after few minutes!',
                200,
                {
                    ReportUrl : "",
                });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    createReportSettings = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId: uuid = await this._validator.getParamUuid(request, 'patientUserId');
            await this.authorizeOne(request, userId);
            const isUserExits = await this._userService.getById(userId);
            if (!isUserExits) {
                throw new ApiError(404, 'User not found.');
            }

            const createModel = await this._validator.create(request);
            createModel.PatientUserId = userId;
            const reportSetting = await this._healthReportSettingService.createReportSettings(createModel);

            if (reportSetting == null) {
                throw new ApiError(400, 'Cannot create health report settings!');
            }
            ResponseHandler.success(request, response, 'Health report settings created successfully!', 201, {
                Setting : reportSetting,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    getReportSettingsByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const userId: uuid = await this._validator.getParamUuid(request, 'patientUserId');
            await this.authorizeOne(request, userId);
            const isUserExits = await this._userService.getById(userId);
            if (!isUserExits) {
                throw new ApiError(404, 'User not found.');
            }

            let existingSettings = await this._healthReportSettingService.getReportSettingsByUserId(userId);
            if (existingSettings == null) {
                const model: HealthReportSettingsDomainModel = this.getHealthReportSettingModel(userId);
                existingSettings = await this._healthReportSettingService.createReportSettings(model);
                if (existingSettings == null) {
                    throw new ApiError(400, 'Cannot create health report settings!');
                }
            }

            ResponseHandler.success(request, response, 'Patient health report settings retrieved successfully!', 200, {
                Settings : existingSettings,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateReportSettingsByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId: uuid = await this._validator.getParamUuid(request, 'patientUserId');
            await this.authorizeOne(request, userId);
            const isUserExits = await this._userService.getById(userId);
            if (!isUserExits) {
                throw new ApiError(404, 'User not found.');
            }
            
            let existingSettings = await this._healthReportSettingService.getReportSettingsByUserId(userId);
            if (existingSettings == null) {
                const model: HealthReportSettingsDomainModel = this.getHealthReportSettingModel(userId);
                existingSettings = await this._healthReportSettingService.createReportSettings(model);
                if (existingSettings == null) {
                    throw new ApiError(400, 'Cannot create health report settings!');
                }
            }

            const updateModel = await this._validator.update(request);
            updateModel.PatientUserId = userId;

            const updatedReportSetting = await this._healthReportSettingService.updateReportSettingsByUserId(
                userId,
                updateModel
            );
            if (updatedReportSetting == null) {
                throw new ApiError(400, 'Unable to update patient health report settings!');
            }

            ResponseHandler.success(request, response, 'Patient health report settings updated successfully!', 200, {
                Settings : updatedReportSetting,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    createReportDocument = async (reportModel: any, filename: string, localFilePath: string): Promise<any> => {
        const { url, resourceId } = await this.uploadFile(localFilePath);
        const mimeType = Helper.getMimeType(filename);
        const documentModel: DocumentDomainModel = {
            DocumentType  : DocumentTypes.Assessment,
            PatientUserId : reportModel.PatientUserId,
            RecordDate    : reportModel.ReportDate,
            UploadedDate  : new Date(),
            FileMetaData  : {
                ResourceId       : resourceId,
                OriginalName     : filename,
                Url              : url,
                IsDefaultVersion : true,
                MimeType         : mimeType,
            }
        };
        const patientDocumentService = Injector.Container.resolve(DocumentService);
        const documentDto = await patientDocumentService.upload(documentModel);
        Logger.instance().log(`Document Id: ${documentDto.id}`);
        return url;
    };

    private uploadFile = async (sourceLocation: string) => {
        const filename = path.basename(sourceLocation);
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const storageKey = `resources/${dateFolder}/${filename}`;
        const dto = await this._fileResourceService.uploadLocal(sourceLocation, storageKey, false);
        const url = dto.DefaultVersion.Url;
        const resourceId = dto.id;
        return { url, resourceId };
    };

    private sendMessageForReportUpdate = async (url: any, reportModel: any) => {

        const patient  = await this._patientService.getByUserId(reportModel.PatientUserId);
        const phoneNumber = patient.User.Person.Phone;
        const person = await this._personService.getById(patient.User.PersonId);
        const systemIdentifier = ConfigurationManager.SystemIdentifier();

        var userFirstName = 'user';
        if (person && person.FirstName) {
            userFirstName = person.FirstName;
        }
        var sendStatus = false;
        Logger.instance().log(`Report URL for Patient ${reportModel.PatientUserId} : ${url}`);
        if (url) {
            const message = `Hi ${userFirstName}, This message is from ${systemIdentifier} App. Your health report has been generated successfully, please check in the medical records.`;
            sendStatus = await Loader.messagingService.sendSMS(phoneNumber, message);
        } else {
            const message = `Hi ${userFirstName}, This message is from ${systemIdentifier} App. There was some issue while generating your health report, please try again!`;
            sendStatus = await Loader.messagingService.sendSMS(phoneNumber, message);
        }
        if (sendStatus) {
            Logger.instance().log(`Message sent successfully`);
        }

        return true;
    };
    //#endregion

    private triggerReportGeneration = async (patientUserId: string, clientCode: string, reportSettings: Settings):
     Promise<any> => {
        const stats = await this._service.getPatientStats(patientUserId, reportSettings);
        const patient = await this._patientService.getByUserId(patientUserId);
        const reportModel = this._service.getReportModel(patient, stats, clientCode);
        if (reportModel.ImageResourceId != null) {
            const profileImageLocation = await this._fileResourceService.downloadById(reportModel.ImageResourceId);
            reportModel.ProfileImagePath = profileImageLocation ??
                Helper.getDefaultProfileImageForGender(patient.User.Person.Gender);
        }
        else {
            reportModel.ProfileImagePath = Helper.getDefaultProfileImageForGender(patient.User.Person.Gender);
        }
        const { filename, localFilePath } = await this._service.generateReport(reportModel, reportSettings);
        const reportUrl = await this.createReportDocument(reportModel, filename, localFilePath);
        this.sendMessageForReportUpdate(reportUrl, reportModel);
        return reportUrl;
    };

    private getHealthReportSettingModel = (patientUserId: string) => {
        const model: HealthReportSettingsDomainModel = {
            PatientUserId : patientUserId,
            Preference    : {
                ReportFrequency             : ReportFrequency.Month,
                HealthJourney               : true,
                MedicationAdherence         : true,
                BodyWeight                  : true,
                BloodGlucose                : true,
                BloodPressure               : true,
                SleepHistory                : true,
                LabValues                   : true,
                ExerciseAndPhysicalActivity : true,
                FoodAndNutrition            : true,
                DailyTaskStatus             : true,
            }
        };
        return model;
    };

}
