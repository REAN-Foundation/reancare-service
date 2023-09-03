import express from 'express';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { Authorizer } from '../../../../auth/authorizer';
import { ResponseHandler } from '../../../../common/response.handler';
import { FileResourceService } from '../../../../services/general/file.resource.service';
import { StatisticsService } from '../../../../services/users/patient/statistics/statistics.service';
import { Loader } from '../../../../startup/loader';
import { StatisticsValidator } from './statistics.validator';
import { Helper } from '../../../../common/helper';
import { DocumentDomainModel } from '../../../../domain.types/users/patient/document/document.domain.model';
import { Logger } from '../../../../common/logger';
import { DocumentTypes } from '../../../../domain.types/users/patient/document/document.types';
import { DocumentService } from '../../../../services/users/patient/document.service';
import { TimeHelper } from '../../../../common/time.helper';
import { DateStringFormat } from '../../../../domain.types/miscellaneous/time.types';
import * as path from 'path';
import { PersonService } from '../../../../services/person/person.service';
import { ConfigurationManager } from '../../../../config/configuration.manager';

///////////////////////////////////////////////////////////////////////////////////////

export class StatisticsController {

    //#region member variables and constructors

    _service: StatisticsService = null;

    _fileResourceService: FileResourceService = null;

    _patientService: PatientService = null;

    _documentService: DocumentService = null;

    _authorizer: Authorizer = null;

    _validator: StatisticsValidator = new StatisticsValidator();

    _personService: PersonService = null;

    constructor() {
        this._service = Loader.container.resolve(StatisticsService);
        this._fileResourceService = Loader.container.resolve(FileResourceService);
        this._patientService = Loader.container.resolve(PatientService);
        this._personService = Loader.container.resolve(PersonService);
        this._documentService = Loader.container.resolve(DocumentService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    getPatientStats = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientStatistics.GetPatientStats';
            //await this._authorizer.authorize(request, response);
            const patientUserId: string = await this._validator.getParamUuid(request, 'patientUserId');
            const stats = await this._service.getPatientStats(patientUserId);
            ResponseHandler.success(request, response, 'Document retrieved successfully!', 200, {
                Statistics : stats,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPatientStatsReport = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientStatistics.GetPatientStatsReport';

            await this._authorizer.authorize(request, response);

            const patientUserId: string = await this._validator.getParamUuid(request, 'patientUserId');
            const clientCode = request.currentClient.ClientCode;

            this.triggerReportGeneration(patientUserId, clientCode);
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
        const patientDocumentService = Loader.container.resolve(DocumentService);
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

    private triggerReportGeneration = async (patientUserId: string, clientCode: string): Promise<any> => {
        const stats = await this._service.getPatientStats(patientUserId);
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
        const { filename, localFilePath } = await this._service.generateReport(reportModel);
        const reportUrl = await this.createReportDocument(reportModel, filename, localFilePath);
        this.sendMessageForReportUpdate(reportUrl, reportModel);
        return reportUrl;
    };

}
